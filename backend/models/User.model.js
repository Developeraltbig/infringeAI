import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      // Simple regex to validate email format
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      // "select: false" ensures the password is not returned in queries by default
      // This matches your controller's .select("+password") logic
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // You can add more roles here if needed
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Mongoose middleware to hash the password before saving a new/updated user
userSchema.pre("save", async function (next) {
  // If the password hasn't been modified, skip hashing (e.g., when updating just the email)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
