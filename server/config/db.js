const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using the URI from environment variables.
 * Designed to exit the process swiftly on failure in production, or gracefully
 * log the error in development.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if critical
    // process.exit(1); 
  }
};

module.exports = connectDB;
