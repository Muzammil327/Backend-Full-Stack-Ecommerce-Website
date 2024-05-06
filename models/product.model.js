import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Enter your Product Name."],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Enter your Product Description."],
  },
  slug: {
    type: String,
    required: [true, "Enter your Product Slug."],
    unique: true,
    lowercase: true,
  },
  category: {
    type: String,
    enum: ["men", "women", "children"],
    lowercase: true,
    required: [true, "Enter your Product Catgeory."],
  },
  subCategory: {
    type: String,
    required: [true, "Enter your Product Sub Catgeory."],
    enum: ["clothing", "accessories"],
    lowercase: true,
  },
  items: {
    type: String,
    enum: ["watches", "shirts"],
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, "Enter your Product Price."],
  },
  discountprice: {
    type: Number,
    required: [true, "Enter your Product Discount Price."],
  },
  quantity: {
    type: Number,
    required: [true, "Enter your Product Quantity in Stock."],
  },
  image: {
    type: String,
    required: [true, "Enter your Product Image."],
  },
  keywords: {
    type: [String],
  },
  slider: {
    type: [String],
  },
  productId: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
  ],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", 
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
const Products =
  mongoose.models.Products || mongoose.model("Products", productsSchema);

export default Products;
