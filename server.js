import app from "./app.js";
import product from "./routes/product.route.js";
import productStep1 from "./routes/product/step1/product.step1.route.js";
import productStep2 from "./routes/product/step2/product.step2.route.js";
import connectDB from "./utils/dbConn.js";

const port = 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api", product);
app.use("/api/v1", productStep1);
app.use("/api/v1", productStep2);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
