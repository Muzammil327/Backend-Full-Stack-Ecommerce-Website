import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

// env
dotenv.config();

const app = express();
const corsURL = [
  "https://full-stack-ecommerce-website-five.vercel.app",
  process.env.corsURL_1,
  process.env.corsURL_2,
  process.env.corsURL_3,
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
app.use(cookieParser());

export default app;
