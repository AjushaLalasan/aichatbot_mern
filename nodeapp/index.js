const express = require("express");
const mongoose = require("mongoose");

const chatBotRouter = require("./routers/chatBotRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors"); // Import the cors package
const corsOptions = {
  origin: "*", // Replace with the URL of your frontend application
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type,Authorization",
};

// Enable CORS with the specified options
app.use(cors(corsOptions));
mongoose
  .connect("mongodb://127.0.0.1:27017/chatbotdb")
  .then(() => {
    console.log("Database connected");
    app.listen(8080, () => {
      console.log("API is running in PORT:8080");
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/chatbots", chatBotRouter);
