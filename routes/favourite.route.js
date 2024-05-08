import express from "express";
import {
  POST_FVOURITE,
  GET_FVOURITE,
  GET_FVOURITE_USER_STATS,
  GET_FVOURITE_ADMIN_STATS,
  DELETE_FAVOURITE,
} from "../controllers/favourite.controller.js";

const router = express.Router();

router.post("/post", POST_FVOURITE);

router.get("/get/:user", GET_FVOURITE);
router.get("/get_admin", GET_FVOURITE_ADMIN_STATS);
router.get("/get_user/:userId", GET_FVOURITE_USER_STATS);

router.delete("/delete/:productId", DELETE_FAVOURITE);

export default router;
