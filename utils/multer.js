import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now, you can use __dirname in your code
const storageMultiple = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploadSliderImage");
    cb(null, uploadDir); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now().toString() + "-" + file.originalname;
    // const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename); // Define the filename
  },
});

const storageUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadBannerImage/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now().toString() + "-" + file.originalname;
    cb(null, uniqueFilename); // Define the filename
  },
});

// // Initialize multer middleware
const uploadBannerImage = multer({ storage: storageUpload });
const uploadSliderImage = multer({ storage: storageMultiple });
export { uploadBannerImage, uploadSliderImage };
