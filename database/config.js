const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DB_CNN);
  } catch (e) {
    console.log(e);
    throw new Error("error en la base de datos - hable con el admin");
  }
};

module.exports = { dbConnection };
