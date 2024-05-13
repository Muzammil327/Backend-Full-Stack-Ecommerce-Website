import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true },
  text: { type: String },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  createdAt: { type: Date, default: Date.now },
});

const Reviews =
  mongoose.models.Reviews || mongoose.model("Reviews", reviewsSchema);

export default Reviews;
// productId, userId, quantity
