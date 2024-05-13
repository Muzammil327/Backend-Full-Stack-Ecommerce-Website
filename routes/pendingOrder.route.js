import express from "express";
import {
  Post_Pending_Order,
  Get_Pending_Order,
  Delete_Pending_Order,
  GET_PENDINGORDER_ADMIN_STATS,
} from "../controllers/pendingOrder.controller.js";

const router = express.Router();

router.post("/post", Post_Pending_Order);
router.get("/stats", GET_PENDINGORDER_ADMIN_STATS);
router.delete("/delete/:pendingOrderId", Delete_Pending_Order);

router.get("/get/:user", Get_Pending_Order);

export default router;
