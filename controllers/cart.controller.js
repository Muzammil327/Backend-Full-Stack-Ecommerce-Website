import slugify from "slugify";
import CartModel from "../models/cart.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Cart = expressAsyncHandler(async (req, res) => {
  try {
    const { _id, name, quantity, price, image, user } = req.body;
console.log(user)
    const newProduct = new CartModel({
      name,
      quantity,
      price,
      image,
      user: user,
      products: _id,
    });
    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Send the saved product as a response
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
