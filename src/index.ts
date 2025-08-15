import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouters from "./routes/auth.routes";

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
app.use("/api/auth", authRouters);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "hello",
  });
});

app.listen(PORT, () => {
  console.log(`you are listening on port ${PORT}`);
});
