require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorMiddleware } = require("./middleware/errorHandler");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const user = require("./routes/user");

app.use(user);
app.use(errorMiddleware);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected!");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
