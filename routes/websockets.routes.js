import url from 'url'
import { Tasks } from "../models/Tasks.js";
import { ws } from '../server.js';
import { findSupervisorByEmailAndInternId, findSupervisorByEmail } from '../services/supervisor.services.js';
import { getTasksByInternIdAndSupervisorId } from '../services/tasks.services.js';
import { taskUpdatesValidator } from '../validations/taskValidator.js';
import { sendMessage } from '../utils/message.js';

export const wsRouter = async (connection, request) => {
    const path = url.parse(request.url, true)
    switch (path.pathname) {
        case '/tasks/updates':
            const { error, value } = taskUpdatesValidator.validate(path.query)

            if (error) {
                const message = error.details[0].message
                sendMessage(connection, false, message)
                return
            }

            switch (value.accountType) {
                case 'supervisor':
                    await supervisorHandler(connection, value)
                    break
                case 'intern':
                    await internHandler(connection, value)
                    break
            }
            break
        default:
            sendMessage(connection, false, "No path found")
    }
}

const supervisorHandler = async (connection, value) => {
    try {
        const supervisor = await findSupervisorByEmail(value.email)

        if (!supervisor) {
            sendMessage(connection, false, "Supervisor not found")
            return
        }

        const connectedInterns = {}

        // Find online interns of the supervisor
        supervisor.assignedInterns.forEach(internId => {
            const internConnection = ws.internConnections[internId.toString()]
            if (internConnection) {
                connectedInterns[internId.toString()] = internConnection
            }
        })

        ws.supervisorConnections[supervisor._id.toString()] = {
            connection: connection,
            interns: connectedInterns
        }

        connection.on("close", () => {
            delete ws.supervisorConnections[supervisor._id.toString()]
            console.log("Disconnected")
        })

    } catch (err) {
        console.error("Database query error:", err.message);
        sendMessage(connection, false, "Database error")
    }
}

const internHandler = async (connection, value) => {
    try {
        const supervisor = await findSupervisorByEmailAndInternId(value)

        if (!supervisor) {
            sendMessage(connection, false, "No supervisor found")
            return
        }
        const supervisorId = supervisor._id.toString()

        let connectionInfo = ws.supervisorConnections[supervisorId]
        if (!connectionInfo) {
            // Inform user that supervisor is not connected yet and add the connection to internConnections
            sendMessage(connection, false, "Your supervisor is not connected yet.")
            ws.internConnections[value.internId] = {
                connection: connection,
                supervisorId: supervisor._id.toString()
            }
        }

        connection.on("message", async () => {
            connectionInfo = ws.supervisorConnections[supervisorId]
            sendMessage(connection)
            if (!connectionInfo) {
                sendMessage(connection, false, "Supervisor already disconnected.")
                return
            }

            ws.supervisorConnections[supervisorId].interns[value.internId] = connection
            const tasks = await getTasksByInternIdAndSupervisorId(supervisor._id, value.internId)
            console.log('Sending tasks')
            connectionInfo.connection.send(JSON.stringify(tasks))
        })

        connection.on('close', async () => {
            delete ws.internConnections[value.internId]
        })
    } catch (err) {
        console.error("Database error", err)
        sendMessage(connection, false, "Database error")
    }
}