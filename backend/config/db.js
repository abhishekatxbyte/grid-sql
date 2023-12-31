import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log()
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
