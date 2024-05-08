import express from "express";
import {
  Post_Cart,
  Get_Cart,
  Delete_Cart,
  Update_Cart_Increase,
  Update_Cart_Decrease,
  GET_CART_ADMIN_STATS,
  GET_CART_USER_STATS,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/post", Post_Cart);

router.get("/get/:user", Get_Cart);
router.get("/get_admin", GET_CART_ADMIN_STATS);
router.get("/get_user/:userId", GET_CART_USER_STATS);

router.delete("/delete/:productId", Delete_Cart);

router.put("/update/increase/:_id", Update_Cart_Increase);
router.put("/update/decrease/:_id", Update_Cart_Decrease);

export default router;
