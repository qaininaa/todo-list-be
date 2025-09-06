import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import { authMiddleware } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/profile", authMiddleware, profileRouter);

app.listen(PORT, () => {
  console.log(`you are listening on port ${PORT}`);
});
