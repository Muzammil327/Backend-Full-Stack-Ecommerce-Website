import express from "express";
import {
  Post_PRODUCT,
  Put_PRODUCT,
  DELETE_PRODUCT,
  DELETE_PRODUCT_IMAGE,
  Delete_SLIDER_IMAGE,
  GET_ADMIN_PRODUCTBYID,
} from "../controllers/product.controller.js";

import { uploadSliderImage } from "../utils/multer.js";

const router = express.Router();

const cpUpload = uploadSliderImage.fields([
  { name: "image", maxCount: 1 },
  { name: "slider", maxCount: 8 },
]);

router.post("/post", cpUpload, Post_PRODUCT);
router.put("/put/:id", cpUpload, Put_PRODUCT);

router.delete("/delete/:id", DELETE_PRODUCT);

router.delete("/deleteImage", DELETE_PRODUCT_IMAGE);
router.delete("/deleteSliderImage", Delete_SLIDER_IMAGE);

router.get("/getid/:id", GET_ADMIN_PRODUCTBYID);

export default router;
