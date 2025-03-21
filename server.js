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

export const app = express();
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

startApp(app, port);
onDbError();
