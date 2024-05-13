import mongoose from "mongoose";
import { Schema } from "mongoose";

const ordersSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  totalPrice: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  qty: {
    type: Number,
    min: 1,
    default: 1,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Orders = mongoose.models.Orders || mongoose.model("Orders", ordersSchema);

export default Orders;

// userId, totalPrice, productId, quantity, status
