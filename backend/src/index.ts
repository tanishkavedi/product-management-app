import express, { Application, Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);  



app.get("/", (req: Request ,res: Response) => {
  res.send("Product Management API running");

});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});