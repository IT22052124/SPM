const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ProductRoute = require("./Routes/ProductRoute");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/product", ProductRoute);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🙂❤️‍🔥`));
  })
  .catch((err) => console.log(err));
