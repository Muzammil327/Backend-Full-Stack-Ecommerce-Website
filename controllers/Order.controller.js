import Orders from "../models/order.model.js";
import Carts from "../models/cart.model.js";
import PendingOrder from "../models/pendingOrder.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Order = expressAsyncHandler(async (req, res) => {
  try {
    const { cartBuy, user, total } = req.body;

    console.log("total:", total);
    console.log(cartBuy, user, total);
    const newProduct = new Orders({
      productId: cartBuy,
      userId: user,
      totalPrice: total,
    });
    // Save the new product to the database
    const savedProduct = await newProduct.save();
    console.log("savedProduct:", savedProduct);
    // Send the saved product as a response
    await Carts.deleteMany({ _id: { $in: cartBuy } });
    await PendingOrder.deleteMany({ _id: { $in: cartBuy } });

    res.status(200).json(savedProduct);
    // }
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
