import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import path from 'path'

const logsDir = path.resolve('logs')

try {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir)
        fs.chmodSync(logsDir, 0o755)
    }
} catch (err) {
    console.error(`Failed to initialize logs directory: ${err.message}`);
}

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, stack, timestamp, service }) => {
    return JSON.stringify({
        timestamp,
        level,
        service,
        message
    });
});

export const logger = (service = 'server') => {
    return createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            customFormat
        ),
        defaultMeta: { service },
        transports: [
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ],
    })
}

