import Favourite from "../models/favourite.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const POST_FVOURITE = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const favourite = await Favourite.findOne({ productId, userId });
    if (favourite) {
      res.status(400).json({ message: "Already item successfully!" });
    } else {
      const newProduct = new Favourite({
        userId,
        productId,
      });
      // Save the new product to the database
      await newProduct.save();

      // Send the saved product as a response
      res.status(200).json({ message: "Items added successfully!" });
    }
  } catch (error) {
    console.error("Error handling Favourite item posting:", error);
    res.status(500).json({
      error: "An error occurred while handling Favourite item posting.",
    });
  }
});

export const GET_FVOURITE_ADMIN_STATS = expressAsyncHandler(
  async (req, res) => {
    try {
      const getFavouriteProducts = await Favourite.aggregate([
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
  }
);

export const GET_FVOURITE_USER_STATS = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const getFavouriteProducts = await Favourite.aggregate([
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

export const GET_FVOURITE = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;

  try {
    const cart = await Favourite.aggregate([
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
          "product.image": 1,
          "product.price": 1,
          "product.name": 1,
          "product.slug": 1,
        },
      },
    ]);
    // Send the saved product as a response
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const DELETE_FAVOURITE = expressAsyncHandler(async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedwishlist = await Favourite.findByIdAndDelete({
      _id: productId,
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
