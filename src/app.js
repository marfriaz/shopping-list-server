const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const ItemsRouter = require("./items/items-router");
const { AuthRouter } = require("./auth/auth-router");

// Express instance created for access to express methods
const app = express();

const morganOption = "common";

// Morgan for request logger middleware
app.use(morgan(morganOption));

// Cors middleware for configuration of CORS in Express
app.use(cors());

// Express router for handling client requests
app.use("/api/items", ItemsRouter);
app.use("/api/auth", AuthRouter);

// Error handler middleware.
app.use(function errorHandler(error, req, res, next) {
  console.error(error);
  let response = { message: error.message, error };

  if (error.code === "Google Authentication Failure") {
    res.status(401).json(response);
  }
  res.status(500).json(response);
});

module.exports = app;
