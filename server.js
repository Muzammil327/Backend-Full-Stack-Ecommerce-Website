import app from "./app.js";
import product from "./routes/product.route.js";
import cart from "./routes/cart.route.js";
import favourite from "./routes/favourite.route.js";
import pendingOrder from "./routes/pendingOrder.route.js";
import order from "./routes/order.route.js";
import user from "./routes/user.route.js";
import connectDB from "./utils/dbConn.js";

const port = 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api/v1/product", product);

app.use("/api/v1/cart", cart);
app.use("/api/v1/favourite", favourite);
app.use("/api/v1/pendingOrder", pendingOrder);
app.use("/api", order);
app.use("/api/v1/user", user);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
