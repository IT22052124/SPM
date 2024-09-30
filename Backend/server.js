import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import ProductRoute from "./Routes/ProductRoute.js";
import LoyaltyRoute from "./Routes/LoyaltyRoute.js";
import PromotionRoute from "./Routes/PromotionRoute.js";
import InvoiceRoute from "./Routes/InvoiceRoute.js";
import Assistant from "./Routes/AssistantRoute.js"
import cors from "cors";
import bodyParser from "body-parser";
import ShoppingList from "./Routes/ShoppingList.js";
import Signin from "./Routes/UserSigninRoute.js"
dotenv.config();
import OpenAI from "openai";
import UserRoute from "./Routes/UserRoute.js";
import { sendOtp, verifyOtp } from './otpService.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  baseURL: "https://api.pawan.krd/cosmosrp-it/v1/chat/completions",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/signin",Signin)
app.use("/user",UserRoute)
app.use("/product", ProductRoute);
app.use("/shoppinglist", ShoppingList);
app.use("/loyalty", LoyaltyRoute);
app.use("/promotion", PromotionRoute);
app.use("/invoice", InvoiceRoute);
app.use("/assistant",Assistant)

app.post("/chatgpt", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    res.json(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error(
      "Error with OpenAI:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Something went wrong!");
  }
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🙂❤️‍🔥`));
  })
  .catch((err) => console.log(err));
