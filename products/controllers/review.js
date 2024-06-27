import mongoose from "mongoose";
import review from "../../products/model/review.model.js";
import expressAsyncHandler from "express-async-handler";

export const Post_Review = expressAsyncHandler(async (req, res) => {
  try {
    // --------------- Extract review details from the request body ---------------
    const { text, rating } = req.body;
    const userId = req.query.userId;
    const productId = req.query.productId;

    // --------------- Validation request body ---------------
    if (!text) {
      res.json({
        status: 400,
        message: "Review Text is Required.",
      });
    }
    if (!rating) {
      res.json({
        status: 400,
        message: "Review Rating is Required.",
      });
    }

    const newReview = new review({
      text,
      rating,
      productId: productId,
      userId: userId,
    });

    await newReview.save();

    // Send response after saving the review
    res.json({
      status: 200,
      message: "Review saved successfully",
    });
  } catch (error) {
    console.error("Error saving review to database:", error);
    // Handle database save error, rollback, etc.
    res.status(500).send("Error saving review to database");
  }
});

export const GET_Reviews = expressAsyncHandler(async (req, res) => {
  const productId = req.query.productId;
  try {
    const getreviews = await review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productId",
        },
      },
      {
        $project: {
          rating: 1,
          text: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.json({
      status: 200,
      message: "Reviews get successfully",
      getreviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
