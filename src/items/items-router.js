const express = require("express");
const ItemsService = require("./items-service");
const ItemsRouter = express.Router();
const { checkAuthenticated } = require("../auth/auth-router");
const jsonBodyParser = express.json();

// All routes, use checkAuthenticated middleware to check if user is authenticated to make request via Google Auth
ItemsRouter.route("/")
  .get(checkAuthenticated, (req, res, next) => {
    let userId = req.user.id;

    ItemsService.getAllItems(req.app.get("db"), userId)
      .then((items) => {
        res.json({ items: items, user: req.user });
      })
      .catch((err) => {
        err.code = "Server Error";
        next(err);
      });
  })

  .delete(checkAuthenticated, (req, res, next) => {
    let userId = req.user.id;

    ItemsService.deleteAllItems(req.app.get("db"), userId)
      .then((numRowsAffected) => {
        res.send({ message: `All items successfully deleted` });
      })
      .catch((err) => {
        err.code = "Server Error";
        next(err);
      });
  })

  .post(checkAuthenticated, jsonBodyParser, (req, res, next) => {
    let userId = req.user.id;

    const { item } = req.body;
    const newItem = {
      item,
      user_id: userId,
    };
    if (item == "" || item == null)
      return res.status(400).send({
        message: `Missing item name. Please add an item name.`,
        error: { code: "Server Error" },
      });

    ItemsService.insertItem(req.app.get("db"), newItem)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch((err) => {
        err.code = "Server Error";
        next(err);
      });
  });

ItemsRouter.route("/:item_id").delete(checkAuthenticated, (req, res, next) => {
  ItemsService.deleteItem(req.app.get("db"), req.params.item_id)
    .then((numRowsAffected) => {
      res.send({
        message: `${req.params.item_id} successfully deleted`,
      });
    })
    .catch((err) => {
      err.code = "Server Error";
      next(err);
    });
});

module.exports = ItemsRouter;
