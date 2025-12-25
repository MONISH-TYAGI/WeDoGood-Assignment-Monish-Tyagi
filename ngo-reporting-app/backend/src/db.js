import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected DB:", mongoose.connection.db.databaseName);
  console.log("MongoDB connected");
};

export default connectDB;
