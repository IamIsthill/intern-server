import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import compression from "compression";
import { connectDb } from "./database/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { router as internAuthRouter } from "./routes/interns-auth-routes.js";
import { Cors } from "./middleware/cors.js";

export const app = express();
const port = 3000;

connectDb();

app.use(compression());
app.use(express.json());
app.use(Cors());
app.use(errorHandler);
app.use("/auth", internAuthRouter);

mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(port, () => {
    console.log(`Intern System Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
