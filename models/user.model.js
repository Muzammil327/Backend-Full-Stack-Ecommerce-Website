import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Enter your Username."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Enter your Email."],
    },
    role: {
      type: string,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
