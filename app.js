import express from "express";
import compression from "compression";
import { errorHandler, Cors, authenticateJWT, setResponseHeaders, limiter, slowLimiter } from "./middleware/index.js";
import { taskRouter, adminRouter, supervisorRouter, departmentRouter, internRouter, internAuthRouter, staffAuthRouter, passwordRouter, healthCheckRouter, uploadRouter } from "./routes/index.js";


export const app = express();

export const loadMiddlewares = (app) => {
    app.use(compression());
    app.use(express.json());
    app.use(Cors());
    app.use(limiter);
    app.use(slowLimiter);
    app.use(setResponseHeaders);
};

export const loadRoutes = (app) => {
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
};

loadMiddlewares(app)
loadRoutes(app)
app.use(errorHandler);