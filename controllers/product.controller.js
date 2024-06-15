import slugify from "slugify";
import products from "../models/product.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import path from "path";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const Post_PRODUCT = expressAsyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      quantity,
      discountprice,
      price,
      status,
      freeDelivery,
      bestPrice,
      feature,
      top,
      items,
      keywords,
      product,
      platform,
      deliveryCharge,
    } = req.body;

    const productIds = Array.isArray(product)
      ? product.map((item) => ({
          value: new mongoose.Types.ObjectId(item.value), // Assuming your Product model uses '_id' field for ID
          label: item.label,
        }))
      : []; // Default to an empty array if `product` is not an array

    const { path } = req.file;
    const imageUrl = await uploadImageToCloudinary(path);
    fs.unlink(path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        // Handle error if needed
      } else {
        console.log("File deleted successfully");
      }
    });
    const slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    const newProduct = new products({
      name,
      description,
      slug,
      image: imageUrl,
      category,
      subCategory,
      discountprice,
      price,
      quantity,
      status,
      freeDelivery,
      bestPrice,
      feature,
      top,
      items,
      keywords,
      product: productIds,
      platform,
      deliveryCharge,
    });
    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Send the saved product as a response
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const DELETE_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const url = req.query.publicId;
  const slider = req.query.slider;

  const parts = url.split("/");

  const publicIdWithExtension = parts[parts.length - 1];
  const parts2 = publicIdWithExtension.split(".");

  const publicId = parts2[0];
  try {
    // Find the product by ID
    const product = await products.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product.slider is defined and not null
    if (Array.isArray(product.slider)) {
      // Delete images from the file system
      product.slider.forEach((imagePath) => {
        try {
          // Construct the absolute path to the image
          const absolutePath = path.resolve(
            __dirname,
            "../uploadSliderImage",
            imagePath
          );
          console.log(absolutePath);
          // Delete the image file
          fs.unlinkSync(absolutePath);

          console.log(`Deleted image: ${absolutePath}`);
        } catch (error) {
          console.error(`Error deleting image: ${imagePath}`, error);
        }
      });
    }

    await products.findByIdAndDelete(id);

    await deleteImageFromCloudinary(publicId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const DELETE_PRODUCT_IMAGE = expressAsyncHandler(async (req, res) => {
  const url = req.query.publicId;
  const parts = url.split("/");

  const publicIdWithExtension = parts[parts.length - 1];
  const parts2 = publicIdWithExtension.split(".");

  const publicId = parts2[0];

  try {
    const deletedProduct = await deleteImageFromCloudinary(publicId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Put_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    subCategory,
    quantity,
    discountprice,
    price,
    status,
    freeDelivery,
    bestPrice,
    feature,
    top,
    items,
    keywords,
    product,
  } = req.body;

  const slug = slugify(name, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "vi",
    trim: true,
  });

  const { path } = req.file;
  const imageUrl = await uploadImageToCloudinary(path);

  fs.unlink(path, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });

  const productIds = Array.isArray(product)
    ? product.map((item) => ({
        value: new mongoose.Types.ObjectId(item.value), // Assuming your Product model uses '_id' field for ID
        label: item.label,
      }))
    : []; // Default to an empty array if `product` is not an array

  try {
    const savedProduct = await products.findByIdAndUpdate(
      id,
      {
        name,
        description,
        slug,
        image: imageUrl,
        category,
        subCategory,
        discountprice,
        price,
        quantity,
        status,
        freeDelivery,
        bestPrice,
        feature,
        top,
        items,
        keywords,
        product: productIds,
      },
      { new: true }
    );
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const Put_PRODUCT_Like = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const product = await products.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  try {
    let updatedProduct;
    const userIndex = product.like.indexOf(user);
    console.log("userIndex Like:", userIndex);

    if (userIndex === -1) {
      updatedProduct = await products.findByIdAndUpdate(
        id,
        {
          $push: { like: new mongoose.Types.ObjectId(user) },
          $pull: { dislike: new mongoose.Types.ObjectId(user) },
        },
        { new: true }
      );
    } else {
      updatedProduct = await products.findByIdAndUpdate(
        id,
        {
          $pull: { like: new mongoose.Types.ObjectId(user) },
        },
        { new: true }
      );
    }

    res.status(200).json({
      message:
        userIndex === -1
          ? "Product liked successfully"
          : "Product unliked successfully",
      product: updatedProduct,
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
  const { user } = req.body;

  const product = await products.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  try {
    let updatedProduct;
    const userIndexLike = product.like.indexOf(user);
    const userIndex = product.dislike.indexOf(user);
    console.log("userIndex Dislike:", userIndex);
    console.log("userIndexLike Dislike:", userIndexLike);

    if (userIndex === -1) {
      updatedProduct = await products.findByIdAndUpdate(
        id,
        {
          $push: { dislike: new mongoose.Types.ObjectId(user) },
          $pull: { like: new mongoose.Types.ObjectId(user) },
        },
        { new: true }
      );
    } else {
      updatedProduct = await products.findByIdAndUpdate(
        id,
        {
          $pull: { dislike: new mongoose.Types.ObjectId(user) },
        },
        { new: true }
      );
    }

    res.status(200).json({
      message:
        userIndex === -1
          ? "Product liked successfully"
          : "Product unliked successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product like:", error);
    res.status(500).json({
      error: "An error occurred while updating product like",
    });
  }
});

export const Put_SLIDER_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const imageSlider = req.files.map((file) => file.filename);

  try {
    const savedSlider = await products.findByIdAndUpdate(
      id,
      { slider: imageSlider },
      { new: true }
    );
    console.log(savedSlider);

    res.status(200).json(savedSlider);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
