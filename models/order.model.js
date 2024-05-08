import mongoose from "mongoose";
import { Schema } from "mongoose";

const ordersSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" }, // Reference to user model
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        min: 1, // Ensure quantity is at least 1
      },
    },
  ],
});

const Orders = mongoose.models.Orders || mongoose.model("Orders", ordersSchema);

export default Orders;
