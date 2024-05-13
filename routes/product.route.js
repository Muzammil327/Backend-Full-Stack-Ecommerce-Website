import express from "express";
import {
  Post_PRODUCT,
  DELETE_PRODUCT,
  DELETE_PRODUCT_IMAGE,
  Put_PRODUCT,
  Put_SLIDER_PRODUCT,
} from "../controllers/product.controller.js";
import {
  GET_PRODUCT_STATS,
  GET_PRODUCT,
  GET_SINGLE_PRODUCT,
  GET_SINGLE_PRODUCTBYID,
  GET_PRODUCT_Admin,
  ALL_GET_PRODUCT,
} from "../controllers/productGet.controller.js";
import { uploadBannerImage, uploadSliderImage } from "../utils/multer.js";

const router = express.Router();

router.post("/post", uploadBannerImage.single("image"), Post_PRODUCT);

router.get("/stats", GET_PRODUCT_STATS);
router.get("/get", GET_PRODUCT); // store => filtering and sorting
router.get("/get/:slug", GET_SINGLE_PRODUCT); // products details
router.get("/getid/:id", GET_SINGLE_PRODUCTBYID);
router.get("/get/admin", GET_PRODUCT_Admin); // store => filtering and sorting
router.get("/get/allProduct", ALL_GET_PRODUCT);

router.delete("/delete/:id", DELETE_PRODUCT);
router.delete("/deleteImage", DELETE_PRODUCT_IMAGE);

router.put("/put/:id", uploadBannerImage.single("image"), Put_PRODUCT);
router.put(
  "/put/slider/:id",
  uploadSliderImage.array("slider"),
  Put_SLIDER_PRODUCT
);

export default router;
