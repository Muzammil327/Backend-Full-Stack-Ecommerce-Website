import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  qty: {
    type: String,
    min: 1,
    default: 1,
  },
  size: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Carts = mongoose.models.Carts || mongoose.model("Carts", cartsSchema);

export default Carts;