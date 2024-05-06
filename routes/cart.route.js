import express from "express";
import {
  Post_Cart,
  Get_Cart,
  Delete_Cart,
  Update_Cart_Increase,
  Update_Cart_Decrease,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/post/cart", Post_Cart);
router.get("/get/cart/:user", Get_Cart);
router.delete("/delete/cart/:productId", Delete_Cart);
router.put("/update/cartIncrease/:_id", Update_Cart_Increase);
router.put("/update/cartDecrease/:_id", Update_Cart_Decrease);
export default router;
