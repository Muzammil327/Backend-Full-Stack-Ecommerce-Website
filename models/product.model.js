import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Enter your Product Name."],
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: [true, "Enter your Product Slug."],
    lowercase: true,
  },
  category: {
    type: String,
    // enum: ["men", "women", "electronics"],
    lowercase: true,
    required: [true, "Enter your Product Catgeory."],
  },
  subCategory: {
    type: String,
    // enum: ["clothing", "accessories"],
    lowercase: true,
    required: [true, "Enter your Product Sub Catgeory."],
  },
  platform: {
    type: String,
    required: [true, "Enter your Product Platform."],
    enum: [
      "markaz",
      "hhcdropshipping",
      "sadadropship",
      // "Shoes 03432229012",
    ],
    lowercase: true,
  },
  items: {
    type: String,
    required: [true, "Enter your Item Keyword."],
    // enum: [
    //   "airpods",
    // ],
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, "Enter your Product Price."],
  },
  color: { type: String },
  image: {
    type: String,
    required: [true, "Enter your Product Image."],
  },
  keywords: {
    type: [String],
    required: [true, "Enter your Keywords."],
  },
  slider: {
    type: [String],
    required: [true, "Enter your Slider Image."],
  },
  status: {
    type: String,
    enum: ["active", "out of stock"],
    default: "active",
  },
  freeDelivery: {
    type: Boolean,
    default: false,
    // select: false,
  },
  bestPrice: {
    type: Boolean,
    default: false,
    // select: false,
  },
  feature: {
    type: Boolean,
    default: false,
    // select: false,
  },
  top: {
    type: Boolean,
    default: false,
    // select: false,
  },
  product: [
    {
      value: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      label: {
        type: String,
      },
    },
  ],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
});
const Products =
  mongoose.models.Products || mongoose.model("Products", productsSchema);

export default Products;
