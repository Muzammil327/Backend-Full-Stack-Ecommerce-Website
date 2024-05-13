import express from "express";
import {
  Post_Cart,
  Get_Cart_User,
  Delete_Cart,
  Update_Cart_Increase,
  Update_Cart_Decrease,
  GET_CART_ADMIN,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/post", Post_Cart);

router.get("/get/:user", Get_Cart_User);
router.get("/stats", GET_CART_ADMIN);

router.delete("/delete/:cartId", Delete_Cart);

router.put("/update/increase/:cartId", Update_Cart_Increase);
router.put("/update/decrease/:cartId", Update_Cart_Decrease);

export default router;