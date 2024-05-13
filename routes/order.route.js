import express from "express";
import {
  Post_Order,
  Get_ORDER_User,
  GET_STATS_Order,
  Update_ORDER,
  getOrdersByStatus,
} from "../controllers/Order.controller.js";

const router = express.Router();

router.get("/stats", GET_STATS_Order);
router.post("/post", Post_Order);
router.get("/get/:user", Get_ORDER_User);
router.put("/update/:orderId", Update_ORDER);
router.get("/get/:status", getOrdersByStatus);

export default router;
