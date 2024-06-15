import POrder from "../models/pendingOrder.model.js";
import Carts from "../models/cart.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Pending_Order = expressAsyncHandler(async (req, res) => {
  try {
    const { product, user, qty } = req.body;
    const existingPendingOrder = await POrder.findOne({ product, user });

    if (existingPendingOrder) {
      // If the same product for the same user already exists, update the quantity
      existingPendingOrder.qty += qty;
      await existingPendingOrder.save();
      res.status(200).json(existingPendingOrder);
    } else {
      // If it's a new product for the user, create a new pending order entry
      const newPendingOrder = new POrder({
        product,
        user,
        qty,
      });
      const savedPendingOrder = await newPendingOrder.save();
      res.status(200).json(savedPendingOrder);
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const GET_PENDINGORDER_ADMIN_STATS = expressAsyncHandler(
  async (req, res) => {
    try {
      const getPendingOrder = await POrder.aggregate([
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      return res.status(200).send(getPendingOrder);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

export const Delete_Pending_Order = expressAsyncHandler(async (req, res) => {
  const { pendingOrderId } = req.params;
  try {
    const deletedPendingOrder = await POrder.findByIdAndDelete({
      _id: pendingOrderId,
    });
    res.status(200).json(deletedPendingOrder);
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
    const pendingOrder = await POrder.aggregate([
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
          "product_Detail.image": 1,
          "product_Detail.price": 1,
          "product_Detail.name": 1,
          "product_Detail.slug": 1,
          "product_Detail.discountprice": 1,
        },
      },
    ]);
    console.log(pendingOrder);
    // Send the saved product as a response
    res.status(200).json(pendingOrder);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
