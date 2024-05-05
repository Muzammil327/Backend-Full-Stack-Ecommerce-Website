import app from "./app.js";
import product from "./routes/product.route.js";
import cart from "./routes/cart.route.js";
import connectDB from "./utils/dbConn.js";

const port = 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api", product);
app.use("/api", cart);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
