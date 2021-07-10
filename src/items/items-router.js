const express = require("express");
const ItemsService = require("./items-service");
const ItemsRouter = express.Router();
const { checkAuthenticated } = require("../auth/auth-router");
const jsonBodyParser = express.json();

ItemsRouter.route("/")
  .get(checkAuthenticated, (req, res, next) => {
    let userId = req.user.id;
    ItemsService.getAllItems(req.app.get("db"), userId)
      .then((items) => {
        res.json({ items: items, user: req.user });
      })
      .catch(next);
  })

  .delete(checkAuthenticated, (req, res, next) => {
    let userId = req.user.id;

    ItemsService.deleteAllItems(req.app.get("db"), userId)
      .then(() => {
        res.status(204).json({ message: `All items successfully deleted` });
      })
      .catch(next);
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
        error: `Missing item name. Please add an item name.`,
      });

    ItemsService.insertItem(req.app.get("db"), newItem)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch(next);
  });

ItemsRouter.route("/:item_id").delete(checkAuthenticated, (req, res, next) => {
  ItemsService.deleteItem(req.app.get("db"), req.params.item_id)
    .then(() => {
      res
        .status(204)
        .json({ message: `${req.params.item_id} successfully deleted` });
    })
    .catch(next);
});

module.exports = ItemsRouter;
