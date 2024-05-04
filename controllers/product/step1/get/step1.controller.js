import slugify from "slugify";
import product from "../../../../models/product.model.js";
import expressAsyncHandler from "express-async-handler";

const Post_STEP1_PRODUCT = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description, category, subCategory } = req.body;

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
    });
    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Send the saved product as a response
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error Step 1 form Submit:", error);
    res.status(500).json({ error: "An error occurred on Step 1 Form." });
  }
});

export default Post_STEP1_PRODUCT;
