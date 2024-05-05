import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to user model
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "products" }, // Reference to product model
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const orders = mongoose.model("orders", ordersSchema);

export default orders;
