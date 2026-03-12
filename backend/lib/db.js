import mongoose from "mongoose";

// A reusable function to connect to MongoDB
export const connectdb = async () => {
  try {
    const con = await mongoose.connect(process.env.mongo_db);
    console.log(`✅ MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
    process.exit(1); // Optional: exit the process if connection fails
  }
};
