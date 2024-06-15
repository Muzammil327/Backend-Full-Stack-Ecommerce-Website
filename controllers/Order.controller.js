import Orders from "../models/order.model.js";
import Carts from "../models/cart.model.js";
import PendingOrder from "../models/pendingOrder.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const GET_STATS_Order = expressAsyncHandler(async (req, res) => {
  try {
    const getTotalOrder = await Orders.aggregate([
      {
        $lookup: {
          from: "products", // Name of the collection to join with
          localField: "product", // Field in the Carts collection
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
          totalPrice: 1,
          status: 1,
          "product.image": 1,
          "product.price": 1,
          "product.name": 1,
          "product.slug": 1,
          "product.discountprice": 1,
        },
      },
    ]);
    return res.status(200).send(getTotalOrder);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const Post_Order = expressAsyncHandler(async (req, res) => {
  try {
    const { product, user, totalPrice, qty } = req.body;

    const newOrder = new Orders({
      product,
      user,
      totalPrice,
      qty,
    });
    // Save the new product to the database
    const savedOrder = await newOrder.save();

    await Carts.deleteMany({ product, user }); // Assuming you can identify cart items by productId and userId
    await PendingOrder.deleteMany({ product, user });
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Get_ORDER_User = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;

  try {
    const order = await Orders.aggregate([
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
          as: "product", // Alias for the joined data
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 1,
          totalPrice: 1,
          status: 1,
          "product.image": 1,
          "product.name": 1,
        },
      },
    ]);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error handling Cart item geting:", error);
    res.status(500).json({ error: "Error handling Cart item geting!" });
  }
});

export const Update_ORDER = expressAsyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error handling Cart item geting:", error);
    res.status(500).json({ error: "Error handling Cart item geting!" });
  }
});

export const getOrdersByStatus = expressAsyncHandler(async (req, res) => {
  const { status } = req.params; // Assuming status is provided as a route parameter

  try {
    const orders = await Orders.find({ status }); // Fetch orders with the specified status

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching orders by status" });
  }
});

export const Delete_Order = expressAsyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const deletedPendingOrder = await Orders.findByIdAndDelete({
      _id: orderId,
    });
    res.status(200).json(deletedPendingOrder);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});