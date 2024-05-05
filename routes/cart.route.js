import express from "express";
import { Post_Cart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/post/cart", Post_Cart);
export default router;
