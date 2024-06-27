import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  image: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  tokenActivate: { type: String },
  emailVerified: { type: Boolean, default: false },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  phone1: { type: String },
  phone2: { type: String },
  additionalInfo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User =
  mongoose.models.users || mongoose.model("users", usersSchema);

export default User;
