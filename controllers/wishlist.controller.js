import WishList from "../models/wishlist.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const POST_Wishlist = expressAsyncHandler(async (req, res) => {
  try {
    const { user, product } = req.body;
    const wishlist = await WishList.findOne({ product, user });
    if (wishlist) {
      res.status(400).json({ message: "Already item successfully!" });
    } else {
      const newProduct = new WishList({
        user,
        product,
      });
      // Save the new product to the database
      await newProduct.save();

      // Send the saved product as a response
      res.status(200).json({ message: "Items added successfully!" });
    }
  } catch (error) {
    console.error("Error handling Wishlist item posting:", error);
    res.status(500).json({
      error: "An error occurred while handling Wishlist item posting.",
    });
  }
});

export const GET_WISHLIST_ADMIN = expressAsyncHandler(async (req, res) => {
  try {
    const getWishlistProducts = await WishList.aggregate([
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).send(getWishlistProducts);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const Get_WishList_USER = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;
  try {
    const wishlist = await WishList.aggregate([
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
          "product_Detail.image": 1,
          "product_Detail.price": 1,
          "product_Detail.name": 1,
          "product_Detail.slug": 1,
        },
      },
    ]);
    // Send the saved product as a response
    res.status(200).json(wishlist);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const DELETE_WishList = expressAsyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  try {
    const deletedwishlist = await WishList.findByIdAndDelete({
      _id: wishlistId,
    });

    // Send the saved product as a response
    res.status(200).json(deletedwishlist);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
