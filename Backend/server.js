import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import ProductRoute from "./Routes/ProductRoute.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/product", ProductRoute);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🙂❤️‍🔥`));
  })
  .catch((err) => console.log(err));
