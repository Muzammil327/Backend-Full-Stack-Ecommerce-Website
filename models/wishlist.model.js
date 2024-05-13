import mongoose from "mongoose";
import { Schema } from "mongoose";

const WishListSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  user: { type: Schema.Types.ObjectId, ref: "Users" },
});

const WishList =
  mongoose.models.WishList || mongoose.model("WishList", WishListSchema);

export default WishList;
