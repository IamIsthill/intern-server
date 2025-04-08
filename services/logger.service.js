import { createLogger, format } from 'winston'
import fs from 'fs'
import path from 'path'
import DailyRotateFile from 'winston-daily-rotate-file'

const logsDir = path.resolve('logs')

try {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir)
        fs.chmodSync(logsDir, 0o755)
    }
} catch (err) {
    console.error(`Failed to initialize logs directory: ${err.message}`);
}

const combinedTransport = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const errorTransport = new DailyRotateFile({
    level: 'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});


const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp, service }) => {
    return JSON.stringify({
        timestamp,
        level,
        service,
        message
    });
});
const loggers = {}

const baseLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        errorTransport,
        combinedTransport,
    ],

})


export const logger = (service = 'server') => {
    return baseLogger.child({ service })
}

