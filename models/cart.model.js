import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartsSchema = new mongoose.Schema({
  // Reference to Products model
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  // Reference to Users model
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Carts = mongoose.models.Carts || mongoose.model("Carts", cartsSchema);

export default Carts;
