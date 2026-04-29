import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    credits: {
      type: Number,
      default: 50,
      min: 0,
    },
  },
  { timestamps: true },
);

// Hash password before save
userSchema.pre("save", async function () {
  // If password is not modified, just return to let Mongoose move on
  if (!this.isModified("password")) return;

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);
export default User;
