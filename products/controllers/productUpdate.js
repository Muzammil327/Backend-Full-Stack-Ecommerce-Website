import product from "../../products/model/product.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const Put_PRODUCT_Like = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  // --------------- Find Product By ID ---------------
  const LikeProduct = await product.findById(id);

  if (!LikeProduct) {
    return res.json({
      status: 400,
      message: "Product not found.",
    });
  }

  try {
    //  --------------- Declare the outer string ---------------
    let updatedProduct;
    const userIndex = LikeProduct.like.indexOf(userId);

    if (userIndex === -1) {
      updatedProduct = await product.findByIdAndUpdate(
        id,
        {
          $push: { like: new mongoose.Types.ObjectId(userId) },
          $pull: { dislike: new mongoose.Types.ObjectId(userId) },
        },
        { new: true }
      );
    } else {
      updatedProduct = await product.findByIdAndUpdate(
        id,
        {
          $pull: { like: new mongoose.Types.ObjectId(userId) },
        },
        { new: true }
      );
    }

    return res.json({
      status: 200,
      message:
        userIndex === -1
          ? "Product liked successfully"
          : "Product unliked successfully",
    });
  } catch (error) {
    console.error("Error updating product like:", error);
    res.status(500).json({
      error: "An error occurred while updating product like",
    });
  }
});

export const Put_PRODUCT_DisLike = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  // --------------- Find Product By ID ---------------
  const LikeProduct = await product.findById(id);
  if (!LikeProduct) {
    return res.json({
      status: 400,
      message: "Product not found.",
    });
  }

  try {
    let updatedProduct;
    const userIndex = LikeProduct.dislike.indexOf(userId);

    if (userIndex === -1) {
      updatedProduct = await product.findByIdAndUpdate(
        id,
        {
          $push: { dislike: new mongoose.Types.ObjectId(userId) },
          $pull: { like: new mongoose.Types.ObjectId(userId) },
        },
        { new: true }
      );
    } else {
      updatedProduct = await product.findByIdAndUpdate(
        id,
        {
          $pull: { dislike: new mongoose.Types.ObjectId(userId) },
        },
        { new: true }
      );
    }
    return res.json({
      status: 200,
      message:
        userIndex === -1
          ? "Product liked successfully"
          : "Product unliked successfully",
    });
  } catch (error) {
    console.error("Error updating product dis like:", error);
    res.status(500).json({
      error: "An error occurred while updating product dis like",
    });
  }
});
