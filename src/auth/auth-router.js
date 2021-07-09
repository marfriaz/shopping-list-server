const express = require("express");
const AuthService = require("./auth-service");

const AuthRouter = express.Router();
const jsonBodyParser = express.json();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "111999925703-s4o9na84cbhohtniij1dihkf4m0b3m0q.apps.googleusercontent.com"
);

AuthRouter.post("/login", jsonBodyParser, async (req, res, next) => {
  // console.log("this is body", req.body);
  // console.log("THIS IS BODY", req.body);

  const { token } = req.body.body.token;
  // console.log("THIS IS FUKN TOKEN", token);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    let loginUser = ticket.getPayload();
    // const { name, email, picture } = loginUser;
    const { email } = loginUser;

    // const user = await db.user.upsert({
    //   where: { email: email },
    //   update: { name, picture },
    //   create: { name, email, picture },
    // });
    const user = await AuthService.createUserIfDoesNotExist(req.app.get("db"), {
      email: email,
    });
    return user;
  }

  verify()
    .then((user) => {
      console.log("VERIOY USER", user);
      console.log("Created token", token);
      res.cookie("session-token", token, { maxAge: 900000, httpOnly: true });
      res.status(201).json(user);
      console.log("HERES RES", res);
      // res.redirect("/");
      // AuthService.getUserWithEmail(req.app.get("db"), email)
      //   .then((dbUser) => {
      //     if (!dbUser)
      //       return res
      //         .status(400)
      //         .json({
      //           error: "Incorrect email or password.",
      //         })
      //         .then(() => {
      //           res.send({
      //             authToken: token,
      //           });
      //         });
      //   })
      //   .catch(next);
    })
    .catch(next);
  // .catch((err) => console.log("ERROR in /login", err));
});

AuthRouter.post("/logout", (req, res, next) => {
  res.clearCookie("session-token");
  res.status(201);
});

async function checkAuthenticated(req, res, next) {
  const token = req.cookies["session-token"];
  // console.log("heres cookies", req.cookies);
  // console.log("HERES TOKENNNNNN", session - token);

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    let loginUser = ticket.getPayload();
    // const { name, email, picture } = loginUser;
    const { email } = loginUser;

    // const user = await db.user.upsert({
    //   where: { email: email },
    //   update: { name, picture },
    //   create: { name, email, picture },
    // });
    user = await AuthService.createUserIfDoesNotExist(req.app.get("db"), {
      email: email,
    });
    return user;
  }
  verify()
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
  // const user = await db.user.findFirst({ where: { id: req.session.userId } });
  // req.user = user;
  // next();
}

module.exports = { AuthRouter, checkAuthenticated };
