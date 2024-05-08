import PendingOrders from "../models/pendingOrder.model.js";
import Carts from "../models/cart.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Pending_Order = expressAsyncHandler(async (req, res) => {
  try {
    const { cartBuy, userId } = req.body;
    const cart = await Carts.findOne({ userId: userId });
    if (cart) {
      res.status(200).json("savedProduct");
    } else {
      const newProduct = new PendingOrders({
        cartBuy: cartBuy,
        userId,
      });
      // Save the new product to the database
      const savedProduct = await newProduct.save();
      // Send the saved product as a response
      // await Carts.deleteMany({ _id: { $in: cartBuy } });

      res.status(200).json(savedProduct);
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Get_Pending_Order = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;
  try {
    const cart = await PendingOrders.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user),
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

export const GET_PENDINGORDER_ADMIN_STATS = expressAsyncHandler(async (req, res) => {
  try {
    const getFavouriteProducts = await PendingOrders.aggregate([
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).send(getFavouriteProducts);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});