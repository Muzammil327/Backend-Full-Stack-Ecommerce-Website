import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    cart: [
      {
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: Number,
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "orders" }], // Reference to orders
  },
  { timestamps: true }
);

const users = mongoose.model("users", usersSchema);

export default users;
