import slugify from "slugify";
import Products from "../models/product.model.js";
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
  // --------------- Check file(s) uploaded ---------------
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files uploaded");
  }

  try {
    const { image, slider } = req.files;

    // --------------- Handle single file ---------------
    if (!image) {
      res.json({
        status: 400,
        message: "Product Image not successfully upload.",
      });
    }

    const imageUrl = await uploadImageToCloudinary(image[0].path);

    // --------------- Handle multiple file upload ---------------
    if (!slider) {
      res.json({
        status: 400,
        message: "Slider Image not successfully upload.",
      });
    }

    // --------------- Extract product details from the request body ---------------
    const {
      name,
      Ldescription,
      Sdescription,
      category,
      subCategory,
      platform,
      items,
      price,
      keywords,
      status,
      freeDelivery,
      bestPrice,
      feature,
      top,
      productId,
    } = req.body;

    // --------------- Validation request body ---------------
    if (!name) {
      res.json({
        status: 400,
        message: "Product Image is Required.",
      });
    }
    if (!Ldescription) {
      res.json({
        status: 400,
        message: "Product Long Description is Required.",
      });
    }
    if (!Sdescription) {
      res.json({
        status: 400,
        message: "Product Short Description is Required.",
      });
    }
    if (!category) {
      res.json({
        status: 400,
        message: "Product Category is Required.",
      });
    }
    if (!subCategory) {
      res.json({
        status: 400,
        message: "Product Sub Category is Required.",
      });
    }
    if (!platform) {
      res.json({
        status: 400,
        message: "Product Platform is Required.",
      });
    }
    if (!items) {
      res.json({
        status: 400,
        message: "Product Items is Required.",
      });
    }
    if (!price) {
      res.json({
        status: 400,
        message: "Product Price is Required.",
      });
    }
    if (!keywords) {
      res.json({
        status: 400,
        message: "Product Keywords is Required.",
      });
    }
    if (!status) {
      res.json({
        status: 400,
        message: "Product Status is Required.",
      });
    }

    //  --------------- Declare the outer array ---------------
    let imageSlider = [];
    let parsedProducts = [];

    // --------------- Handle Slider ---------------
    if (slider) {
      if (Array.isArray(slider)) {
        try {
          // Map over the array of files and upload each one asynchronously
          imageSlider = await Promise.all(
            slider.map(async (file) => {
              const uploadedImagePath = await uploadImageToCloudinary(
                file.path
              );
              return uploadedImagePath;
            })
          );
        } catch (error) {
          console.error("Error uploading slider image:", error);
        }
      }
    }

    // --------------- Handle Product Id ---------------
    if (productId) {
      if (Array.isArray(productId)) {
        parsedProducts = productId.map((p) => {
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
            typeof productId === "string" ? JSON.parse(productId) : productId,
          ];
        } catch (error) {
          console.error("Error parsing product item:", error);
          throw new Error("Invalid product format");
        }
      }
    }

    // --------------- Handle Slug ---------------
    const slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    // --------------- Handle Product Id ---------------
    const Gross_Price = price;

    const newProduct = new Products({
      name,
      Ldescription: Ldescription,
      Sdescription: Sdescription,
      slug,
      category,
      subCategory,
      platform,
      items,
      price: Gross_Price,
      image: imageUrl, // Store Cloudinary image URL in the database
      keywords,
      slider: imageSlider, // Store Cloudinary image URL in the database
      status,
      freeDelivery,
      bestPrice,
      feature,
      top,
      productId: parsedProducts,
    });

    await newProduct.save();

    // Send response after saving the product
    res.json({
      status: 200,
      message: "Product saved successfully",
    });
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
      Sdescription,
      Ldescription,
      category,
      subCategory,
      quantity,
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
    } = req.body;

    const existingProduct = await Products.findById(id);
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

    const savedProduct = await Products.findByIdAndUpdate(
      id,
      {
        name,
        Sdescription,
        Ldescription,
        slug,
        image: imageUrl || existingProduct.image,
        category,
        subCategory,
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

  if (!url || !slider) {
    return res
      .status(400)
      .json({ error: "Public ID and slider information are required" });
  }

  try {
    // Find the product by ID
    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (url) {
      const parts = url.split("/");
      const publicIdWithExtension = parts[parts.length - 1];
      const parts2 = publicIdWithExtension.split(".");
      const publicIdUrl = parts2[0];
      await deleteImageFromCloudinary(publicIdUrl);
    }

    // Delete each slider image if provided
    if (slider) {
      const sliderUrls = slider.split(",");
      for (const sliderUrl of sliderUrls) {
        const parts = sliderUrl.trim().split("/");
        const publicIdWithExtension = parts[parts.length - 1];
        const parts2 = publicIdWithExtension.split(".");
        const publicIdUrl = parts2[0];
        await deleteImageFromCloudinary(publicIdUrl);
      }
    }

    await Products.findByIdAndDelete(id);

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
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const deletedProduct = await deleteImageFromCloudinary(publicId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
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

export const Delete_SLIDER_IMAGE = expressAsyncHandler(async (req, res) => {
  const url = req.query.publicId;
  const id = req.query.id;
  const parts = url.split("/");

  const publicIdWithExtension = parts[parts.length - 1];
  const parts2 = publicIdWithExtension.split(".");

  const publicId = parts2[0];

  try {
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const deletedProduct = await deleteImageFromCloudinary(publicId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Remove the URL from the product's slider array
    product.slider = product.slider.filter((imageUrl) => imageUrl !== url);

    await product.save();

    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});

export const GET_ADMIN_PRODUCTBYID = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // const getProduct = await products.findById(id);
    const getProduct = await Products.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          Sdescription: 1,
          Ldescription: 1,
          slug: 1,
          category: 1,
          subCategory: 1,
          items: 1,
          price: 1,
          image: 1,
          keywords: 1,
          status: 1,
          freeDelivery: 1,
          bestPrice: 1,
          feature: 1,
          top: 1,
          deliveryCharge: 1,
          platform: 1,
          slider: 1,
          productId: {
            $map: {
              input: "$productId",
              as: "item",
              in: {
                label: "$$item.label",
                value: "$$item.value",
              },
            },
          },
        },
      },
    ]);

    if (getProduct) {
      return res.status(200).json(getProduct[0]);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
