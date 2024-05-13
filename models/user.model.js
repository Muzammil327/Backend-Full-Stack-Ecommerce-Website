import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);

export default Users;
