import express from "express";
import {
  GET_PRODUCT,
  Post_PRODUCT,
  GET_PRODUCT_LOW_TO_HIGH,
  GET_SINGLE_PRODUCT,
  GET_ALL_PRODUCT,
  Put_PRODUCT,
} from "../controllers/product.controller.js";
import multer from "multer";
import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();
cloudinary.config({
  cloud_name: "desggllml",
  api_key: "837553215969782",
  api_secret: "zypuvbf8YyPZAixTcvuxWhycZro",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "some-folder-name",
    public_id: (req, file) => slugify(file.originalname, { lower: true }), // Use slugified original filename as public_id
  },
});

const parser = multer({ storage: storage });
router.get("/get/product", GET_PRODUCT);
router.get("/get/product/lowToHigh", GET_PRODUCT_LOW_TO_HIGH);
router.get("/get/allProduct", GET_ALL_PRODUCT);
router.post("/post/product", parser.single("image"), Post_PRODUCT);
router.put("/put/product/:id", parser.array("slider"), Put_PRODUCT);
router.get("/get/product/:slug", GET_SINGLE_PRODUCT);

export default router;
