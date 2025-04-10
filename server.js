import "dotenv/config";
import express from "express";
import http from "http";
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
import { wsRouter } from "./routes/websockets.routes.js";
import { limiter } from "./services/rateLimiter.js";
import { logger as log } from "./services/logger.service.js";
import { healthCheckRouter } from "./routes/health-check.routes.js";
import { uploadRouter } from "./routes/uploadRoutes.routes.js";

const logger = log();
logger.info("Server starting");

export const app = express();
export const server = http.createServer(app);
export const ws = new WebSocketServer({ server: server });

ws.websocket.on("connection", wsRouter);

const port = 3000;

connectDb();
app.use(compression());
app.use(express.json());
app.use(Cors());
app.use(limiter);
app.use("/password", passwordRouter);
app.use("/auth", internAuthRouter);
app.use("/a2kstaffs", staffAuthRouter);
app.use("/healthcheck", healthCheckRouter);
app.use(authenticateJWT);
app.use("/interns", internRouter);
app.use("/admin", adminRouter);
app.use("/tasks", taskRouter);
app.use("/supervisors", supervisorRouter);
app.use("/departments", departmentRouter);
app.use("/files", uploadRouter);

app.use(errorHandler);

startApp(server, port);
onDbError();
