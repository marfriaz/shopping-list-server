const express = require("express");
const AuthService = require("./auth-service");
const AuthRouter = express.Router();
const jsonBodyParser = express.json();
const { OAuth2Client } = require("google-auth-library");

// clientID would normally be kept as a secret in a .env file.
// Set as a variable for simplicity
let clientID =
  "111999925703-s4o9na84cbhohtniij1dihkf4m0b3m0q.apps.googleusercontent.com";

const client = new OAuth2Client(clientID);

// Handles login route, by authenticating user login and return token
AuthRouter.post("/login", jsonBodyParser, async (req, res, next) => {
  const { token } = req.body;

  verify(token, req, res, next)
    .then((user) => {
      res.status(201).json({ authToken: token, user: user });
    })
    .catch((err) => {
      err.code = "Server Error";
      next(err);
    });
});

// Check if user is authenticated to make GET, POST, DELETE request via Google auth from token
async function checkAuthenticated(req, res, next) {
  const token = req.get("Authorization") || "";

  verify(token, req, res, next)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      err.code = "Server Error";
      next(err);
    });
}

// Validates user's token via Google Auth
// Error specifies if error is because of Google Authentication Failure so client can action
async function verify(token, req, res, next) {
  const ticket = await client
    .verifyIdToken({
      idToken: token,
      audience: clientID,
    })
    .catch((err) => {
      err.code = "Google Authentication Failure";
      next(err);
    });

  let loginUser = ticket.getPayload();
  const { email, name } = loginUser;

  const newUser = {
    email: email,
    name: name,
  };

  let user = await AuthService.getUserWithEmail(req.app.get("db"), email);

  if (user == null) {
    user = await AuthService.createUser(req.app.get("db"), newUser);
  }
  return user;
}

module.exports = { AuthRouter, checkAuthenticated, verify };
