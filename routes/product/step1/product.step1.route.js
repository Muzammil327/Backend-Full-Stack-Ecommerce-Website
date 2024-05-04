import express from "express";

import Post_STEP1_PRODUCT from "../../../controllers/product/step1/post/step1Post.controller.js";
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
    folder: "Banner-Product-image",
    public_id: (req, file) => slugify(file.originalname, { lower: true }),
  },
});

const parser = multer({ storage: storage });
// router.get("/get/product", GET_PRODUCT);
// router.get("/get/allProduct", GET_ALL_PRODUCT);
router.post("/product/step1/post", parser.single("image"), Post_STEP1_PRODUCT);
// router.get("/get/product/:slug", GET_SINGLE_PRODUCT);

export default router;
