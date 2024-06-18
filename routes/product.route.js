import express from "express";
import {
  Post_PRODUCT,
  DELETE_PRODUCT,
  DELETE_PRODUCT_IMAGE,
  Put_PRODUCT,
  Put_PRODUCT_DisLike,
  Put_PRODUCT_Like,
  Delete_SLIDER_IMAGE,
} from "../controllers/product.controller.js";
import {
  GET_PRODUCT_STATS,
  GET_PRODUCT,
  GET_SINGLE_PRODUCT,
  GET_SINGLE_PRODUCTBYID,
} from "../controllers/productGet.controller.js";
import { uploadBannerImage, uploadSliderImage } from "../utils/multer.js";

const router = express.Router();

const cpUpload = uploadSliderImage.fields([
  { name: "image", maxCount: 1 },
  { name: "slider", maxCount: 8 },
]);

router.post("/post", cpUpload, Post_PRODUCT);
router.put("/put/:id", cpUpload, Put_PRODUCT);
router.delete("/deleteImage", DELETE_PRODUCT_IMAGE);
router.delete("/delete/:id", DELETE_PRODUCT);
router.delete("/deleteSliderImage", Delete_SLIDER_IMAGE);

router.get("/stats", GET_PRODUCT_STATS); // Product_GET
router.get("/get", GET_PRODUCT); // Product_STORE
router.get("/get/:slug", GET_SINGLE_PRODUCT); // products details
router.get("/getid/:id", GET_SINGLE_PRODUCTBYID);

router.put("/put/like/:id", Put_PRODUCT_Like);
router.put("/put/dislike/:id", Put_PRODUCT_DisLike);


export default router;
