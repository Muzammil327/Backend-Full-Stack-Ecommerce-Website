import slugify from "slugify";
import Carts from "../models/cart.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Cart = expressAsyncHandler(async (req, res) => {
  try {
    const { _id, name, user } = req.body;
    const cart = await Carts.findOne({ productId: _id });
    if (cart) {
      // If cart item exists, increase its quantity
      cart.quantity += 1;
      // Save the updated cart item
      await cart.save(); // Make sure to await the save operation
      // Send a success response
      res.status(200).json({ message: "Cart item updated successfully" });
    } else {
      const newProduct = new Carts({
        name,
        userId: user,
        productId: _id,
      });
      // Save the new product to the database
      const savedProduct = await newProduct.save();

      // Send the saved product as a response
      res.status(200).json(savedProduct);
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Get_Cart = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;
  try {
    const cart = await Carts.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user),
        },
      },
      {
        $lookup: {
          from: "products", // Name of the collection to join with
          localField: "productId", // Field in the Carts collection
          foreignField: "_id", // Field in the Products collection
          as: "product", // Alias for the joined data
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          // createdAt: 1,
          "product.image": 1,
          "product.price": 1,
          "product.name": 1,
        },
      },
    ]);
    // Send the saved product as a response
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Delete_Cart = expressAsyncHandler(async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedCart = await Carts.findByIdAndDelete({ _id: productId });

    // Send the saved product as a response
    res.status(200).json(deletedCart);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Update_Cart_Increase = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { quantity } = req.body;
  try {
    const existingProduct = await Carts.findOne({
      _id: _id,
    });
    if (existingProduct) {
      // If the product already exists, increase its quantity
      existingProduct.quantity = quantity + 1;
      await existingProduct.save();
      res.status(200).json(existingProduct);

    } else {
      const newCart = new CartModel({
        quantity: parsedQuantity,
      });
      const savedCart = await newCart.save();
      console.log(savedCart);

      res.status(200).json(savedCart);
    }

    // Send the saved product as a response
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Update_Cart_Decrease = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { quantity } = req.body;
  try {
    const existingProduct = await Carts.findOne({
      _id: _id,
    });
    if (existingProduct) {
      // If the product already exists, increase its quantity
      existingProduct.quantity = quantity - 1;
      await existingProduct.save();
      res.status(200).json(existingProduct);

    } else {
      const newCart = new CartModel({
        quantity: parsedQuantity,
      });
      const savedCart = await newCart.save();
      console.log(savedCart);

      res.status(200).json(savedCart);
    }

    // Send the saved product as a response
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
