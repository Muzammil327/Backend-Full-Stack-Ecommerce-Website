import product from "../../products/model/product.model.js";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import { uploadImageToCloudinary } from "../../utils/cloudinary.js";

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
      description,
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
    if (!description) {
      res.json({
        status: 400,
        message: "Product Description is Required.",
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

    const newProduct = new product({
      name,
      description,
      slug,
      category,
      subCategory,
      platform,
      items,
      price,
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
