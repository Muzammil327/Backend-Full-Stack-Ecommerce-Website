import express from "express";
import {
  GET_PRODUCT_Card,
  GET_DETAIL_PRODUCT,
  GET_ADMIN_PRODUCTBYID,
} from "./controllers/productGet.js";
import { Post_PRODUCT } from "./controllers/productPost.js";
import {
  Put_PRODUCT_Like,
  Put_PRODUCT_DisLike,
} from "./controllers/productUpdate.js";
import { Post_Review, GET_Reviews } from "./controllers/review.js";

import { uploadSliderImage } from "../utils/multer.js";

const router = express.Router();

const cpUpload = uploadSliderImage.fields([
  { name: "image", maxCount: 1 },
  { name: "slider", maxCount: 12 },
]);

// product
router.post("/post", cpUpload, Post_PRODUCT);
router.put("/put/like/:id", Put_PRODUCT_Like);
router.put("/put/dislike/:id", Put_PRODUCT_DisLike);
router.get("/get/productCard", GET_PRODUCT_Card);
router.get("/get/productDetail/:slug", GET_DETAIL_PRODUCT);
router.get("/get/productId/:id", GET_ADMIN_PRODUCTBYID); // dashboard for update product card and details

// review
router.post("/review/post", Post_Review);
router.get("/review/get", GET_Reviews);

export default router;
