import express from "express";
import { PUT_USER_Image } from "../controllers/user.controller.js";
import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now, you can use __dirname in your code
const storageMultiple = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/user_image");
    cb(null, uploadDir); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now().toString() + "-" + file.originalname;
    // const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename); // Define the filename
  },
});

// // Initialize multer middleware
const uploadSliderImage = multer({ storage: storageMultiple });

router.put(
  "/update/image/:userId",
  uploadSliderImage.single("image"),
  PUT_USER_Image
);

export default router;
