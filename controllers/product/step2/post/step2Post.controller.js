import product from "../../../../models/product.model.js";
import expressAsyncHandler from "express-async-handler";

const STEP2_Post_PRODUCT = expressAsyncHandler(async (req, res) => {;
  try {
    const { quantity, price, productId, discountprice } = req.body;
console.log(req.body)
    const newProduct = new product({
      price,
      quantity,
      productId: productId,
      discountprice,
    });
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error Step 2 form Submit:", error);
    res.status(500).json({ error: "An error occurred on Step 2 Form." });
  }
});

export default STEP2_Post_PRODUCT;
