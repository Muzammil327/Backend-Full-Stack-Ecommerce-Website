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
  // Check if file(s) were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files uploaded");
  }

  try {
    const { image, slider } = req.files;

    // Handle single file upload 'image'
    if (!image) {
      return res.status(400).send("Image file is required");
    }

    const imageUrl = await uploadImageToCloudinary(image[0].path); // Assuming uploadImageToCloudinary uploads single image

    // Handle multiple file upload 'slider'
    if (!slider) {
      return res.status(400).send("Slider images are required");
    }

    // Extract product details from the request body
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
      platform,
      product,
      deliveryCharge,
      value,
    } = req.body;
    let imageSlider = []; // Declare the outer array

    if (slider) {
      if (Array.isArray(slider)) {
        try {
          // Map over the array of files and upload each one asynchronously
          imageSlider = await Promise.all(
            // Remove 'const' here
            slider.map(async (file) => {
              // Assuming file.path is the correct property for the file's path
              const uploadedImagePath = await uploadImageToCloudinary(
                file.path
              );
              return uploadedImagePath;
            })
          );
        } catch (error) {
          console.error("Error uploading images:", error);
          // Handle or log the error appropriately
        }
      }
    }

    let parsedProducts = [];
    if (product) {
      if (Array.isArray(product)) {
        parsedProducts = product.map((p) => {
          try {
            return typeof p === "string" ? JSON.parse(p) : p;
          } catch (error) {
            console.error("Error parsing product item:", error);
            throw new Error("Invalid product format");
          }
        });
      } else {
        try {
          parsedProducts = [
            typeof product === "string" ? JSON.parse(product) : product,
          ];
        } catch (error) {
          console.error("Error parsing product item:", error);
          throw new Error("Invalid product format");
        }
      }
    }

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
      image: imageUrl, // Store Cloudinary image URL in the database
      category,
      subCategory,
      discountprice,
      price,
      quantity,
      status,
      freeDelivery,
      slider: imageSlider,
      bestPrice,
      feature,
      top,
      items,
      keywords,
      product: parsedProducts,
      platform,
      deliveryCharge,
      value,
    });

    const savedProduct = await newProduct.save();

    // Send response after saving the product
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error saving product to database:", error);
    // Handle database save error, rollback, etc.
    res.status(500).send("Error saving product to database");
  }
});

export const Put_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const { image, slider } = req.files;
    let imageUrl;
    if (image) {
      imageUrl = await uploadImageToCloudinary(image[0].path); // Assuming uploadImageToCloudinary uploads single image
    }

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
      platform,
      product,
      deliveryCharge,
    } = req.body;

    const existingProduct = await products.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    let mergedSlider = existingProduct.slider || [];
    if (slider) {
      if (Array.isArray(slider)) {
        // Map over the array of files and upload each one
        const uploadedImages = await Promise.all(
          slider.map(async (file) => {
            const uploadedImagePath = await uploadImageToCloudinary(file.path);
            return uploadedImagePath;
          })
        );
        mergedSlider = [...mergedSlider, ...uploadedImages];
      } else {
        // Handle single file upload scenario
        const uploadedImagePath = await uploadImageToCloudinary(slider.path);
        mergedSlider.push(uploadedImagePath);
      }
    }

    let parsedProducts = [];
    if (product) {
      if (Array.isArray(product)) {
        parsedProducts = product.map((p) => {
          try {
            return typeof p === "string" ? JSON.parse(p) : p;
          } catch (error) {
            console.error("Error parsing product item:", error);
            throw new Error("Invalid product format");
          }
        });
      } else {
        try {
          parsedProducts = [
            typeof product === "string" ? JSON.parse(product) : product,
          ];
        } catch (error) {
          console.error("Error parsing product item:", error);
          throw new Error("Invalid product format");
        }
      }
    }

    const slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    const savedProduct = await products.findByIdAndUpdate(
      id,
      {
        name,
        description,
        slug,
        image: imageUrl || existingProduct.image,
        category,
        subCategory,
        discountprice,
        price,
        quantity,
        status,
        freeDelivery,
        slider: mergedSlider,
        bestPrice,
        feature,
        top,
        items,
        keywords,
        product: parsedProducts,
        platform,
        deliveryCharge,
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
          // Delete the image file
          fs.unlinkSync(absolutePath);
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
  const id = req.query.id;
  const parts = url.split("/");

  const publicIdWithExtension = parts[parts.length - 1];
  const parts2 = publicIdWithExtension.split(".");

  const publicId = parts2[0];

  try {
    const deletedProduct = await deleteImageFromCloudinary(publicId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    // Remove the URL from the product's images object
    if (product.images === url) {
      product.images = "";
    }
    await product.save();

    res.status(200).json(deletedProduct);
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

export const Delete_SLIDER_IMAGE = expressAsyncHandler(async (req, res) => {
  const url = req.query.publicId;
  const id = req.query.id;
  const parts = url.split("/");

  const publicIdWithExtension = parts[parts.length - 1];
  const parts2 = publicIdWithExtension.split(".");

  const publicId = parts2[0];

  try {
    const deletedProduct = await deleteImageFromCloudinary(publicId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    // Remove the URL from the product's slider array
    product.slider = product.slider.filter((imageUrl) => imageUrl !== url);

    await product.save();
    // await product.save();

    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
