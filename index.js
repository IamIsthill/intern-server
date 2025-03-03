require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const compression = require("compression");
const { connectDb } = require("./database");
const errorHandler = require("./middleware/errorHandler");
const internAuthRouter = require("./routes/interns.auth");

const app = express();
const port = 3000;

connectDb();

app.use(compression());
app.use(express.json());
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
