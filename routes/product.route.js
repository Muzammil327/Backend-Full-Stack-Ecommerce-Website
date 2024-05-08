import express from "express";
import {
  Post_PRODUCT,
  Put_PRODUCT,
  ALL_GET_PRODUCT,
} from "../controllers/product.controller.js";
import multer from "multer";
import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { GET_PRODUCT_STATS, GET_PRODUCT, GET_SINGLE_PRODUCT } from "../controllers/product/get/productGet.controller.js";

const router = express.Router();
cloudinary.config({
  cloud_name: "desggllml",
  api_key: "837553215969782",
  api_secret: "zypuvbf8YyPZAixTcvuxWhycZro",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "banner-product",
    public_id: (req, file) => {
      const timestamp = Date.now(); // Get current timestamp
      const fileName = slugify(file.originalname, { lower: true }); // Slugify original filename
      return `${timestamp}_${fileName}`; // Concatenate timestamp and filename
    },
  },
});
const parser = multer({ storage: storage });
const storageMultiple = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "slider-product",
    public_id: (req, file) => {
      const timestamp = Date.now(); // Get current timestamp
      const fileName = slugify(file.originalname, { lower: true }); // Slugify original filename
      return `${timestamp}_${fileName}`; // Concatenate timestamp and filename
    },
  },
});
const parserMultiple = multer({ storage: storageMultiple });

router.get("/stats", GET_PRODUCT_STATS);
router.get("/get", GET_PRODUCT); // store => filtering and sorting
router.get("/get/:slug", GET_SINGLE_PRODUCT); // products details

router.get("/get/allProduct", ALL_GET_PRODUCT);
router.post("/post/product", parser.single("image"), Post_PRODUCT);
router.put("/put/product/:id", parserMultiple.array("slider"), Put_PRODUCT);

export default router;
