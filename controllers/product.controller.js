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
  const page = parseInt(req.query.page) || 1; // Default page is 1 if not provided or invalid
  const limit = parseInt(req.query.limit) || 6;
  const subCategory = req.query.subCatgeory; // Directly use the category query parameter
  const category = req.query.category; // Directly use the category query parameter
  const tags = req.query.tags; // Directly use the category query parameter

  const lowToHigh = req.query.lowToHigh;
  const highToLow = req.query.highToLow;
  const lowPrice = parseInt(req.query.lowPrice);
  const highPrice = parseInt(req.query.highPrice);

  const getproducts = await product.find();
  try {
    let aggregationPipeline = [
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
          price: 1,
          category: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    if (category) {
      aggregationPipeline.unshift({ $match: { category: category } });
    }
    if (subCategory) {
      aggregationPipeline.unshift({ $match: { subCategory: subCategory } });
    }
    if (tags) {
      aggregationPipeline.unshift({ $match: { tags: tags } });
    }
    if (lowPrice && highPrice) {
      aggregationPipeline.unshift({
        $match: { price: { $gte: lowPrice, $lte: highPrice } },
      });
    }
    aggregationPipeline = aggregationPipeline.filter(
      (stage) => !("$sort" in stage)
    );

    if (lowToHigh) {
      aggregationPipeline.unshift({ $sort: { price: 1 } });
    } else if (highToLow) {
      aggregationPipeline.unshift({ $sort: { price: -1 } });
    }
    const getproduct = await product.aggregate(aggregationPipeline);
    const perPageArray = getproduct.length;
    const endResult = perPageArray * page;
    const startResult =
      getproduct.length === 0 ? 0 : (page - 1) * getproduct.length + 1;

    const response = {
      products: getproduct,
      pagination: {
        page: page,
        limit: limit,
        endResult: endResult,
        startResult: startResult,
        totalPages: Math.ceil(getproducts.length / limit),
        totalResults: getproducts.length,
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
export const GET_PRODUCT_LOW_TO_HIGH = expressAsyncHandler(async (req, res) => {
  const getproducts = await product.find();
  try {
    let aggregationPipeline = [
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
          price: 1,
          category: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const getproduct = await product.aggregate(aggregationPipeline);
    const perPageArray = getproduct.length;
    const endResult = perPageArray * page;
    const startResult =
      getproduct.length === 0 ? 0 : (page - 1) * getproduct.length + 1;

    const response = {
      products: getproduct,
      pagination: {
        page: page,
        limit: limit,
        endResult: endResult,
        startResult: startResult,
        totalPages: Math.ceil(getproducts.length / limit),
        totalResults: getproducts.length,
      },
    };
    return res.status(200).send(response);
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
      discountprice,
      price,
      productId,
    } = req.body;
    const image = req.file.filename;

    const slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    const newProduct = new product({
      name,
      description,
      slug,
      image,
      category,
      subCategory,
      discountprice,
      price,
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
export const Put_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const imageSlider = req.files.map((file) => file.filename);

    const savedProduct = await product.findByIdAndUpdate(
      id,
      { slider: imageSlider },
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
