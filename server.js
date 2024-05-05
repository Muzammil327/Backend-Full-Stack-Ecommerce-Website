import app from "./app.js";
import product from "./routes/product.route.js";
import connectDB from "./utils/dbConn.js";

const port = 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api", product);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
