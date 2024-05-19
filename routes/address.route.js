import express from "express";
import {
  Post_Address,
  Get_Single_Address,
  Update_Address,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/post", Post_Address);
router.get("/get/:user", Get_Single_Address);
router.put("/update/:id", Update_Address);

export default router;
