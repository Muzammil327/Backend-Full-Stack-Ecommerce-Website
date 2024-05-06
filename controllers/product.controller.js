import slugify from "slugify";
import products from "../models/product.model.js";
import expressAsyncHandler from "express-async-handler";

export const ALL_GET_PRODUCT = expressAsyncHandler(async (req, res) => {
  try {
    const getproducts = await products.find();

    console.log(getproducts);
    return res.status(200).send(getproducts);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const GET_PRODUCT = expressAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const subCategory = req.query.subCatgeory;
  const category = req.query.category;
  const tags = req.query.tags;

  const lowToHigh = req.query.lowToHigh;
  const highToLow = req.query.highToLow;
  const lowPrice = parseInt(req.query.lowPrice);
  const highPrice = parseInt(req.query.highPrice);

  const getproducts = await products.find();
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
    const getproduct = await products.aggregate(aggregationPipeline);
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
    console.log(response);
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const GET_SINGLE_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(slug);

  try {
    // const getProduct = await product.findOne({ slug });
    const getProduct = await products.aggregate([
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
          "relatedProducts.slug": 1, // Include the related products in the result
          "relatedProducts.price": 1, // Include the related products in the result
          "relatedProducts.category": 1, // Include the related products in the result
        },
      },
    ]);
    const singleProduct = getProduct[0];
    if (singleProduct) {
      return res.status(200).json(singleProduct);
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

    const newProduct = new products({
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

    const savedProduct = await products.findByIdAndUpdate(
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
