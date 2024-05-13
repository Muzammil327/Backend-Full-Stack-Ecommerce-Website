import express from "express";
import {
  POST_Wishlist,
  Get_WishList_USER,
  GET_WISHLIST_ADMIN,
  DELETE_WishList,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/post", POST_Wishlist);

router.get("/get/:user", Get_WishList_USER);
router.get("/stats", GET_WISHLIST_ADMIN);

router.delete("/delete/:wishlistId", DELETE_WishList);

export default router;
