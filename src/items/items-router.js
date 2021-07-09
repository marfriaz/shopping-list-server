const express = require("express");
// const path = require("path");
const ItemsService = require("./items-service");
const { checkAuthenticated } = require("../auth/auth-router");
const ItemsRouter = express.Router();
const jsonBodyParser = express.json();

ItemsRouter.route("/")
  .get(checkAuthenticated, (req, res, next) => {
    let loginUser = req.user.id;
    let userId = ItemsService.getUserId(loginUser.email);

    ItemsService.getAllItems(req.app.get("db"), userId)
      .then((items) => {
        res.json(items);
      })
      .catch(next);
  })

  .delete(checkAuthenticated, (req, res, next) => {
    let loginUser = req.user.id;
    let userId = ItemsService.getUserId(loginUser.email);

    ItemsService.deleteAllItems(req.app.get("db"), userId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .post(checkAuthenticated, jsonBodyParser, (req, res, next) => {
    let loginUser = req.user.id;
    let userId = ItemsService.getUserId(loginUser.email);

    const { item } = req.body;

    const newItem = {
      item,
      userIid: userId,
    };

    // FIX
    if (item == "" || item == null)
      return res.status(400).send({
        error: `Missing Item in request body`,
      });

    ItemsService.insertItem(req.app.get("db"), newItem)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch(next);
  });

ItemsRouter.route("/:item_id")
  .all(checkItemIdExists)
  .delete(checkAuthenticated, (req, res, next) => {
    ItemsService.deleteItem(req.app.get("db"), req.params.item_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkItemIdExists(req, res, next) {
  try {
    const item = await ItemsService.getByItemId(
      req.app.get("db"),
      req.params.item_id
    );

    if (!item)
      return res.status(404).json({
        error: `Item doesn't exist`,
      });

    res.item = item;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = ItemsRouter;
