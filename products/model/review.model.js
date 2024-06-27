import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  rating: { type: Number, required: true },
  text: { type: String },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  createdAt: { type: Date, default: Date.now },
});

const review = mongoose.models.review || mongoose.model("review", reviewSchema);

export default review;
// productId, userId, rating, text, like, dislike
