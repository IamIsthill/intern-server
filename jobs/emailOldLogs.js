import cron from 'node-cron'
import fs from 'fs'
import path from 'path'
import { sendLogs } from '../services/mail.js'
import { logger as log } from '../services/logger.service.js'

const logger = log('logs-job')

const logsDir = path.resolve('logs')

cron.schedule('0 8 * * *', async () => {
    try {
        const files = fs.readdirSync(logsDir)
        const threshold = Date.now() - 13 * 24 * 60 * 60 * 1000

        const oldLogs = files.filter(file => {
            const filePath = path.join(logsDir, file)
            const stats = fs.statSync(filePath) // read the metadata of the file
            return stats.mtimeMs < threshold
        })

        if (oldLogs.length <= 0) return

        await sendLogs('Server Logs', 'Find attached server logs', oldLogs.map(file => ({ filename: file, path: path.join(logsDir, file) })))

    } catch (err) {
        logger.error('Failed to send old logs: ', err.message)
    }
})