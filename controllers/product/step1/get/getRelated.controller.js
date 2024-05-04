import slugify from "slugify";
import product from "../models/product.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const GET_ALL_PRODUCT = expressAsyncHandler(async (req, res) => {
  try {
    const getproduct = await product.find();
    return res.status(200).send(getproduct);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
export const GET_PRODUCT = expressAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page); // Default page is 1 if not provided or invalid
  const limit = parseInt(req.query.limit);
  const category = req.query.category; // Directly use the category query parameter
  console.log(category);
  try {
    let aggregationPipeline = [
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          slider: 1,
          description: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    if (category) {
      aggregationPipeline.unshift({ $match: { category: category } });
    }

    const getproduct = await product.aggregate(aggregationPipeline);

    console.log(getproduct);
    return res.status(200).send(getproduct);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const GET_SINGLE_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    // const getProduct = await product.findOne({ slug });
    const getProduct = await product.aggregate([
      {
        $match: { slug },
      },
      {
        $lookup: {
          from: "products", // Change this to the correct collection name if it's different
          localField: "productId",
          foreignField: "_id",
          as: "relatedProducts", // Name of the field to store the related products
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          image: 1,
          category: 1,
          subCategory: 1,
          price: 1,
          quantity: 1,
          slider: 1,
          "relatedProducts._id": 1, // Include the related products in the result
          "relatedProducts.name": 1, // Include the related products in the result
          "relatedProducts.image": 1, // Include the related products in the result
          "relatedProducts.description": 1, // Include the related products in the result
          "relatedProducts.slug": 1, // Include the related products in the result
        },
      },
    ]);
    console.log(getProduct);
    if (getProduct) {
      return res.status(200).json(getProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const Post_PRODUCT = expressAsyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      quantity,
      price,
      productId,
    } = req.body;

    const imageSlider = req.files.map((file) => file.filename);
    const slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    console.log("Form fields:", req.body);
    const newProduct = new product({
      name,
      description,
      slug,
      slider: imageSlider,
      category,
      price,
      subCategory,
      quantity,
      productId: productId,
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
