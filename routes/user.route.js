import express from "express";
import {
  GET_USER_ADMIN_STATS,
  GET_SINGLE_USER,
  PUT_USER,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/stats", GET_USER_ADMIN_STATS);
router.get("/get/:id", GET_SINGLE_USER);

router.put("/update/:id", PUT_USER);

export default router;
