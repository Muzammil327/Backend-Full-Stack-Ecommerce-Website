import mongoose, { Schema } from "mongoose";

const pendingOrdersSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" }, // Reference to user model
  cartBuy: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const PendingOrders =
  mongoose.models.PendingOrders ||
  mongoose.model("PendingOrders", pendingOrdersSchema);

export default PendingOrders;
