import Address from "../models/address.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Post_Address = expressAsyncHandler(async (req, res) => {
  try {
    const {
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      phone1,
      phone2,
      additionalInfo,
      user,
    } = req.body;

    const newProduct = new Address({
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      phone1,
      phone2,
      additionalInfo,
      user,
    });
    const savedProduct = await newProduct.save();
    res.status(200).json({ message: "Shippping Address Updated!", savedProduct });
  } catch (error) {
    console.error("Error handling Cart item posting:", error);
    res.status(500).json({ error: "Error handling Cart item posting!" });
  }
});

export const Update_Address = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    addressLine1,
    addressLine2,
    city,
    postalCode,
    country,
    phone1,
    phone2,
    additionalInfo,
  } = req.body;
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        addressLine1,
        addressLine2,
        city,
        postalCode,
        country,
        phone1,
        phone2,
        additionalInfo,
      },
      {
        new: true, // Return the updated document
      }
    );

    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Error updating address" });
  }
});

export const Get_Single_Address = expressAsyncHandler(async (req, res) => {
  const { user } = req.params;

  try {
    const cart = await Address.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user),
        },
      },
      {
        $lookup: {
          from: "users", // Name of the collection to join with
          localField: "user", // Field in the Carts collection
          foreignField: "_id", // Field in the Products collection
          as: "user_details", // Alias for the joined data
        },
      },
      {
        $unwind: "$user_details",
      },
      {
        $project: {
          _id: 1,
          addressLine1: 1,
          addressLine2: 1,
          city: 1,
          postalCode: 1,
          country: 1,
          phone1: 1,
          phone2: 1,
          additionalInfo: 1,
          createdAt: 1,
          "user_details._id": 1,
          "user_details.username": 1,
          "user_details.email": 1,
        },
      },
    ]);
    console.log(cart)
    res.status(200).json(cart[0]);
  } catch (error) {
    console.error("Error handling Cart item geting:", error);
    res.status(500).json({ error: "Error handling Cart item geting!" });
  }
});
