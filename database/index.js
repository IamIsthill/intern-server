import mongoose from 'mongoose';
export * from './connectDb.js'

export const startApp = (app, port) => {
    mongoose.connection.once("open", () => {
        console.log("Connected to database");
        app.listen(port, () => {
            console.log(`Intern System Server running on port ${port}`);
        });
    });
}

export const onDbError = () => {
    mongoose.connection.on("error", (err) => {
        console.log(err);
    });
}