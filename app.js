import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

// env
dotenv.config();

const app = express();
const corsURL = [
  "https://full-stack-ecommerce-website-five.vercel.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: corsURL,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

export default app;
