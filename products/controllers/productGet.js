import products from "../../products/model/product.model.js";
import expressAsyncHandler from "express-async-handler";

export const GET_PRODUCT_Card = expressAsyncHandler(async (req, res) => {
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
  const addAmount = 1250;
  const discountAmount = 1000;
  try {
    let aggregationPipeline = [
      {
        $addFields: {
          adjustedPrice: {
            $subtract: [{ $add: ["$price", addAmount] }, discountAmount],
          }, // Adjusted price
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
          price: "$adjustedPrice", // Using the adjusted price
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
      aggregationPipeline.unshift({ $match: { items: tags } });
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
        endResult: endResult,
        startResult: startResult,
        totalResults: getproducts.length,
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export const GET_DETAIL_PRODUCT = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const getProduct = await products.aggregate([
      {
        $match: { slug },
      },
      {
        $lookup: {
          from: "products", // Change this to the correct collection name if it's different
          localField: "product.value",
          foreignField: "_id",
          as: "product_details", // Name of the field to store the related products
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
          items: 1,
          price: 1,
          slider: 1,
          like: 1,
          dislike: 1,
          "product_details._id": 1, // Include the related product_detailss in the result
          "product_details.name": 1, // Include the related product_detailss in the result
          "product_details.image": 1, // Include the related product_detailss in the result
          "product_details.slug": 1, // Include the related product_detailss in the result
          "product_details.price": 1, // Include the related product_detailss in the result
          "product_details.category": 1, // Include the related products in the result
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

export const GET_ADMIN_PRODUCTBYID = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // const getProduct = await products.findById(id);
    const getProduct = await products.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          description: 1,
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
          product: {
            $map: {
              input: "$product",
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
