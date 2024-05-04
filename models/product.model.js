import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
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
    required: [true, "Enter your Product Items."],
    required: true,
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
  // keywords: {
  //   type: [String],
  // },
  slider: {
    type: [String],
  },
  productId: [
    { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  ],
  // saleProductId: [{ type: mongoose.Schema.Types.ObjectId, ref: "saleProduct" }],
  // like: [{ type: mongoose.Schema.Types.ObjectId, ref: "saleProduct" }],
  // dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "saleProduct" }],
});

const product = mongoose.model("product", productSchema);

export default product;
