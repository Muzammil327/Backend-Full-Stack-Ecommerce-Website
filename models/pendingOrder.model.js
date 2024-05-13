import mongoose, { Schema } from "mongoose";

const POrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  qty: {
    type: Number,
    min: 1,
    default: 1,
  },
});

const POrder =
  mongoose.models.POrder ||
  mongoose.model("POrder", POrderSchema);

export default POrder;

// userId, productId, quantity
