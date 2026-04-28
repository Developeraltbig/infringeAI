import mongoose from "mongoose";
import User from "./User.js";

const MONGO_URI =
  "mongodb+srv://hostingserver:w9joXkQUNeWB2mmk@cluster0.htawuq1.mongodb.net/infringement";

const seedUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Database");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "raj@gmail.com" });
    if (existingUser) {
      // If they exist but have no credits, top them up
      if (
        typeof existingUser.credits !== "number" ||
        existingUser.credits === 0
      ) {
        await User.findByIdAndUpdate(existingUser._id, { credits: 50 });
        console.log("Existing user credits updated to 50!");
      } else {
        console.log(
          `User already exists with ${existingUser.credits} credits.`,
        );
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    const newUser = await User.create({
      name: "Raj",
      email: "raj@gmail.com",
      password: "123456",
      role: "admin",
      credits: 50,
    });

    console.log("User created successfully!");
    console.log(newUser);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
};

// One-time migration: give 50 credits to ALL existing users who have none
const migrateAllUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Database for migration");

    const result = await User.updateMany(
      { credits: { $exists: false } },
      { $set: { credits: 50 } },
    );
    console.log(
      `Migration complete: ${result.modifiedCount} users updated with 50 credits`,
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error.message);
    process.exit(1);
  }
};

// Run: node seed.js          → creates/tops up raj@gmail.com
// Run: node seed.js migrate  → gives 50 credits to all existing users
if (process.argv[2] === "migrate") {
  migrateAllUsers();
} else {
  seedUser();
}
