const mongoose = require("mongoose");
const { DATABASE_URI } = require("../config");

const connectDb = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
  } catch (e) {
    console.log("Database error: ", e.message);
  }
};

module.exports = {
  connectDb,
};
