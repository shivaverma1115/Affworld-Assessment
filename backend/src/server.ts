import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 5000;

require("dotenv").config();

const mongoUrl = `${process.env.MONGO_URL}`;

const mongooseOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
};

async function serverConnect() {
  try {
    await mongoose.connect(mongoUrl, mongooseOptions);
    console.log("databes connected");

    app.listen(port, () => {
      console.log(` app listening on port ${port}`);
    });
  } catch (e) {
    console.log("server err", e);
  }
}

serverConnect();
