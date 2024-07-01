import app from "./app.js";

import products from "./routes/product.route.js";

import connectDB from "./utils/dbConn.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use(
  "/uploadSliderImage",
  express.static(path.join(__dirname, "uploadSliderImage"))
);

app.use("/api/v1/product", products);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
