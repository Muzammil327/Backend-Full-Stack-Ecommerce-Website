import express from "express";
import { GET_ALL_USER, GET_SINGLE_USER } from "../controllers/user/get/userGet.controller.js";
import { PUT_USER } from "../controllers/user/put/userUpdate.controller.js";

const router = express.Router();

router.get("/get/user", GET_ALL_USER);
router.get("/get/user/:id", GET_SINGLE_USER);

router.put("/update/user/:id", PUT_USER);
export default router;
