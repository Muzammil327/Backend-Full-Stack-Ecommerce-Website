import express from "express";
import {
  Post_Pending_Order,
  Get_Pending_Order,
  Delete_Cart,
  Update_Cart_Increase,
  Update_Cart_Decrease,
} from "../controllers/pendingOrder.controller.js";

const router = express.Router();

router.post("/post/pendingOrder", Post_Pending_Order);
router.get("/get/pendingOrder/:user", Get_Pending_Order);
router.delete("/delete/cart/:productId", Delete_Cart);
router.put("/update/cartIncrease/:_id", Update_Cart_Increase);
router.put("/update/cartDecrease/:_id", Update_Cart_Decrease);
export default router;
