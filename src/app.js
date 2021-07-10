require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { NODE_ENV } = require("./config");
const ItemsRouter = require("./items/items-router");
const { AuthRouter } = require("./auth/auth-router");

const app = express();

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());

app.use("/api/items", ItemsRouter);
app.use("/api/auth", AuthRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
