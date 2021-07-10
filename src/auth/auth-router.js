const express = require("express");
const AuthService = require("./auth-service");
const AuthRouter = express.Router();
const jsonBodyParser = express.json();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  "111999925703-s4o9na84cbhohtniij1dihkf4m0b3m0q.apps.googleusercontent.com"
);

AuthRouter.post("/login", jsonBodyParser, async (req, res, next) => {
  const { token } = req.body;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    let loginUser = ticket.getPayload();
    console.log("loginUser", loginUser);
    const { email } = loginUser;

    const user = await AuthService.createUser(req.app.get("db"), {
      email: email,
    });
    return user;
  }

  verify()
    .then((user) => {
      res.status(201).json({ authToken: token, user: user });
    })
    .catch(next);
});

AuthRouter.post("/logout", (req, res, next) => {
  res.clearCookie("session-token");
  res.status(201);
});

async function checkAuthenticated(req, res, next) {
  const token = req.get("Authorization") || "";
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    let loginUser = ticket.getPayload();
    const { email } = loginUser;

    const user = await AuthService.getUserWithEmail(req.app.get("db"), email);

    if ([user].length === 0) {
      user = AuthService.createUser(req.app.get("db"), {
        email: email,
      });
    }
    return user;
  }
  verify()
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
}

module.exports = { AuthRouter, checkAuthenticated };
