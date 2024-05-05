import express from "express";
import { Post_Cart, Get_Cart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/post/cart", Post_Cart);
router.get("/get/cart/:user", Get_Cart);
export default router;
