import Carts from "../models/cart.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Cart = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Carts.findOne({ productId });
    if (cart) {
      // If cart item exists, increase its quantity
      cart.quantity += 1;
      // Save the updated cart item
      await cart.save(); // Make sure to await the save operation
      // Send a success response
      res.status(200).json({ message: "Cart item updated successfully" });
    } else {
      const newProduct = new Carts({
        userId,
        productId,
      });
      // Save the new product to the database
      const savedProduct = await newProduct.save();
      console.log(savedProduct)

      // Send the saved product as a response
      res
        .status(200)
        .json({ message: "New Items added successfully!", savedProduct });
    }
  } catch (error) {
    console.error("Error handling Cart item posting:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling Cart item posting." });
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

export const GET_CART_ADMIN_STATS = expressAsyncHandler(async (req, res) => {
  try {
    const getFavouriteProducts = await Carts.aggregate([
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

export const GET_CART_USER_STATS = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const getFavouriteProducts = await Carts.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
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
      // Decrease the quantity if it's greater than 1
      if (existingProduct.quantity > 1) {
        existingProduct.quantity = quantity - 1;
        await existingProduct.save();
        res.status(200).json(existingProduct);
      } else {
        // If quantity is 1 or less, remove the item from the cart
        await Carts.deleteOne({ _id: _id }); // Adjust this line
        res.status(200).json({ message: "Product removed from cart" });
      }
    } else {
      const newCart = new Carts({
        quantity: parsedQuantity,
      });
      const savedCart = await newCart.save();
      console.log(savedCart);

      res.status(200).json(savedCart);
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
