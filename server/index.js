import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/dbConnect.js";
import cropRouter from "./routes/crop.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/crop", cropRouter);

app.get("/", (req, res) => {
  res.send("AgroConnect API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});