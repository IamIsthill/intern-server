import "dotenv/config";
import express from "express";
import compression from "compression";
import { connectDb, startApp, onDbError } from "./database/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { Cors } from "./middleware/cors.js";
import { authenticateJWT } from "./middleware/auth.js";
import { taskRouter } from "./routes/task.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { supervisorRouter } from "./routes/supervisor.routes.js";
import { departmentRouter } from "./routes/department.routes.js";
import { internRouter } from "./routes/interns.routes.js";
import { router as internAuthRouter } from "./routes/interns-auth.routes.js";
import { router as staffAuthRouter } from "./routes/staff-auth.routes.js";
import { passwordRouter } from "./routes/password.routes.js";
import { WebSocketServer } from "./services/websocket.js";
import url from 'url'
import http from 'http'
import { Supervisor } from "./models/Supervisor.js";
import { Tasks } from "./models/Tasks.js";
import { createId } from "./utils/createId.js";
import Joi from "joi";

const taskUpdatesValidator = Joi.object({
    accountType: Joi.string().valid('intern', 'supervisor').required(),
    email: Joi.string().email({ tlds: false }),
    internId: Joi.string().hex().optional().length(24)
})


export const app = express();
export const server = http.createServer(app)
export const ws = new WebSocketServer({ server: server })

ws.websocket.on("connection", async (connection, request) => {
    const path = url.parse(request.url, true)
    switch (path.pathname) {
        case '/tasks/updates':
            const { error, value } = taskUpdatesValidator.validate(path.query)

            if (error) {
                const message = error.details[0].message
                connection.send(new Message(false, message).json())
                return
            }

            switch (value.accountType) {
                case 'supervisor':
                    try {
                        const supervisor = await Supervisor.findOne({ email: value.email })

                        if (!supervisor) {
                            const data = new Message(false, "Supervisor not found")
                            connection.send(data.json());
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
                        console.error("Database query error:", error);
                        connection.send(JSON.stringify({ error: "Database error" }));
                    }
                    break
                case 'intern':
                    try {
                        const supervisor = await Supervisor.findOne({ assignedInterns: { $in: createId(value.internId) } })

                        if (!supervisor) {
                            const data = new Message(false, "No supervisor found").json()
                            connection.send(data)
                            return
                        }
                        const supervisorId = supervisor._id.toString()

                        let connectionInfo = ws.supervisorConnections[supervisorId]
                        if (!connectionInfo) {
                            // Inform user that supervisor is not connected yet and add the connection to internConnections
                            const data = new Message(false, "Your supervisor is not connected yet.").json()
                            connection.send(data)
                            ws.internConnections[value.internId] = {
                                connection: connection,
                                supervisorId: supervisor._id.toString()
                            }

                        }
                        connection.on("message", async () => {
                            connectionInfo = ws.supervisorConnections[supervisorId]
                            connection.send(new Message().json())
                            if (!connectionInfo) {
                                connection.send(new Message(false, "Supervisor already disconnected.").json())
                                return
                            }

                            ws.supervisorConnections[supervisorId].interns[value.internId] = connection
                            const tasks = await Tasks.find({
                                supervisor: supervisor._id,
                                assignedInterns: {
                                    $elemMatch: { internId: value.internId }
                                }
                            }).select(['-__v'])
                            console.log('Sending tasks')
                            connectionInfo.connection.send(JSON.stringify(tasks))
                        })
                        connection.on('close', async () => {
                            delete ws.internConnections[value.internId]
                        })




                    } catch (err) {
                        console.error("Database error", err)
                        const data = new Message(false, "Database error").json()
                        connection.send(data)
                    }
                    break
            }


            break
        default:
            connection.send(new Message(false, "No path found").json())
    }
})

const port = 3000;

connectDb();

app.use(compression());
app.use(express.json());
app.use(Cors());
app.use('/password', passwordRouter)
app.use("/auth", internAuthRouter);
app.use("/a2kstaffs", staffAuthRouter);
app.use(authenticateJWT);
app.use("/interns", internRouter);
app.use("/admin", adminRouter);
app.use("/tasks", taskRouter);
app.use("/supervisors", supervisorRouter);
app.use("/departments", departmentRouter);
app.use(errorHandler);

startApp(server, port);
onDbError();

class Message {
    constructor(success = true, message = "Success") {
        this.success = success
        this.message = message
    }

    json() {
        const data = {
            success: this.success,
            message: this.message
        }

        return JSON.stringify(data)
    }
}