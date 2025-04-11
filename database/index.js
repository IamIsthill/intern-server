import mongoose from 'mongoose';
export * from './connectDb.js'
import { logger as log } from '../services/logger.service.js';

const logger = log('database')

export const startApp = (app, port) => {
    mongoose.connection.once("open", () => {
        logger.info("Connected to database")
        app.listen(port, () => {
            console.log(`Intern System Server running on port ${port}`);
            logger.info(`Intern System Server running on port ${port}`)
        });
    });
}

export const onDbError = () => {
    mongoose.connection.on("error", (err) => {
        logger.error(err.message)
        console.log(err);

    });
}