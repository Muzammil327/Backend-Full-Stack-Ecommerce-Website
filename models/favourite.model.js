import mongoose from "mongoose";
import { Schema } from "mongoose";

const FavouritesSchema = new mongoose.Schema({
  // Reference to Products model
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  // Reference to Users model
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favourites =
  mongoose.models.Favourites || mongoose.model("Favourites", FavouritesSchema);

export default Favourites;
