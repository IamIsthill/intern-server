import http from "http"
import { connectDb, startApp, onDbError } from "./database/index.js";
import { WebSocketServer } from "./services/websocket.js";
import { wsRouter } from "./routes/websockets.routes.js";
import { logger as log } from "./services/logger.service.js";
import './jobs/emailOldLogs.js'
import { app } from "./app.js";

const logger = log();

const port = process.env.PORT || 3000
export const server = http.createServer(app);
export const ws = new WebSocketServer({ server: server });
ws.websocket.on("connection", wsRouter);



connectDb();
startApp(server, port);
onDbError();

logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);