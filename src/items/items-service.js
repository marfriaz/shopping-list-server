const ItemsService = {
  getAllItems(db, user_id) {
    return db
      .from("items")
      .select("*")
      .where("items.user_id", user_id)
      .orderBy("items.date_created");
  },

  deleteAllItems(db, user_id) {
    return db.raw(`DELETE from items where user_id=${user_id};`);
  },

  deleteItem(db, item_id) {
    return db.raw(`DELETE from items where id=${item_id};`);
  },

  insertItem(db, item) {
    return db
      .insert(item)
      .into("items")
      .returning("*")
      .where("items.user_id", item.user_id)
      .then(([item]) => item);
  },
};

module.exports = ItemsService;
