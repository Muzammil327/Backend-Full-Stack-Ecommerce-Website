import express from "express";
import {
  Post_Pending_Order,
  Get_Pending_Order,
  Delete_Cart,
  GET_PENDINGORDER_ADMIN_STATS,
} from "../controllers/pendingOrder.controller.js";

const router = express.Router();

router.post("/post", Post_Pending_Order);
router.get("/stat", GET_PENDINGORDER_ADMIN_STATS);
router.get("/get/pendingOrder/:user", Get_Pending_Order);
router.delete("/delete/cart/:productId", Delete_Cart);

export default router;
