import mongoose from "mongoose";
import { config } from "./config.js";
const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log("✅ Connected to database successfully");
  } catch (err) {
    console.error("❌ Failed to connect DB", err);
    process.exit(1);
  }
};

export default connectDB;

