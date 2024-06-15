import Carts from "../models/cart.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Cart = expressAsyncHandler(async (req, res) => {
  try {
    const { user, product } = req.body;

    const cart = await Carts.findOne({ product, user });
    if (cart) {
      cart.qty += 1;
      await cart.save();
      res.status(200).json({ message: "Cart updated successfully" });
    } else {
      const newProduct = new Carts({
        user,
        product,
      });
      const savedProduct = await newProduct.save();
      res
        .status(200)
        .json({ message: "New Items added in Cart!", savedProduct });
    }
  } catch (error) {
    console.error("Error handling Cart item posting:", error);
    res.status(500).json({ error: "Error handling Cart item posting!" });
  }
});

export const Get_Cart_User = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;

  try {
    const cart = await Carts.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user),
        },
      },
      {
        $lookup: {
          from: "products", // Name of the collection to join with
          localField: "product", // Field in the Carts collection
          foreignField: "_id", // Field in the Products collection
          as: "product_Detail", // Alias for the joined data
        },
      },
      {
        $unwind: "$product_Detail",
      },
      {
        $project: {
          _id: 1,
          qty: 1,
          "product_Detail._id": 1,
          "product_Detail.image": 1,
          "product_Detail.price": 1,
          "product_Detail.name": 1,
          "product_Detail.discountprice": 1,
          "product_Detail.deliveryCharge": 1,
        },
      },
    ]);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error handling Cart item geting:", error);
    res.status(500).json({ error: "Error handling Cart item geting!" });
  }
});

export const GET_CART_ADMIN = expressAsyncHandler(async (req, res) => {
  try {
    const getTotalCart = await Carts.aggregate([
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).send(getTotalCart);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const Delete_Cart = expressAsyncHandler(async (req, res) => {
  const { cartId } = req.params;
  try {
    const deletedCart = await Carts.findByIdAndDelete({ _id: cartId });
    res
      .status(200)
      .json({ message: "Cart Item Deleted Successfully!", deletedCart });
  } catch (error) {
    console.error("Error handling Cart item deleting:", error);
    res.status(500).json({ error: "Error handling Cart item deleting" });
  }
});

export const Update_Cart_Increase = expressAsyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const { qty } = req.body;
  try {
    const existingProduct = await Carts.findOne({
      _id: cartId,
    });
    if (existingProduct) {
      // If the product already exists, increase its quantity
      existingProduct.qty = qty + 1;
      await existingProduct.save();
      res.status(200).json(existingProduct);
    } else {
      const newCart = new CartModel({
        qty: parsedQuantity,
      });
      const savedCart = await newCart.save();

      res.status(200).json(savedCart);
    }
  } catch (error) {
    console.error("Error handling Cart item Increasing:", error);
    res.status(500).json({ error: "Error handling Cart item Increasing" });
  }
});

export const Update_Cart_Decrease = expressAsyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const { qty } = req.body;
  try {
    const existingProduct = await Carts.findOne({
      _id: cartId,
    });
    if (existingProduct) {
      // Decrease the quantity if it's greater than 1
      if (existingProduct.qty > 1) {
        existingProduct.qty = qty - 1;
        await existingProduct.save();
        res.status(200).json(existingProduct);
      } else {
        // If quantity is 1 or less, remove the item from the cart
        await Carts.deleteOne({ _id: cartId }); // Adjust this line
        res.status(200).json({ message: "Product removed from cart" });
      }
    } else {
      const newCart = new Carts({
        qty: parsedQuantity,
      });
      const savedCart = await newCart.save();

      res.status(200).json(savedCart);
    }
  } catch (error) {
    console.error("Error handling Cart item Decreasing:", error);
    res.status(500).json({ error: "Error handling Cart item Decreasing" });
  }
});
