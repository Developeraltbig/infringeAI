import mongoose from "mongoose";
import User from "./User.js"; // Adjust the path to your User model file

// Replace with your actual MongoDB connection string
const MONGO_URI =
  "mongodb+srv://hostingserver:w9joXkQUNeWB2mmk@cluster0.htawuq1.mongodb.net/infringement";

const seedUser = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Database");

    // 2. Check if user already exists to prevent duplicate key errors
    const existingUser = await User.findOne({ email: "raj@gmail.com" });
    if (existingUser) {
      console.log("User already exists!");
      process.exit();
    }

    // 3. Create the user
    // We use .create() because it triggers your pre('save') hook to hash the password
    const newUser = await User.create({
      name: "Raj", // Name is required by your schema!
      email: "raj@gmail.com",
      password: "123456",
      role: "admin", // Optional: Set to admin if you are creating a master account
    });

    console.log("User created successfully!");
    console.log(newUser);

    // 4. Disconnect from database
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
};

seedUser();
