import mongoose, { Document, Schema } from "mongoose";

// Define the schema for the order model
const cartsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" }, // Reference to user model
    products: { type: Schema.Types.ObjectId, ref: "products" }, // Reference to user model
    name: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const CartModel =
  mongoose.models.CartModel || mongoose.model("CartModel", cartsSchema);

export default CartModel;
