import express from "express";
import Post_STEP2_PRODUCT from "../../../controllers/product/step2/post/step2Post.controller.js";

const router = express.Router();

router.put("/product/step2/post", Post_STEP2_PRODUCT);

export default router;
