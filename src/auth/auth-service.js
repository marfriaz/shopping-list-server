const AuthService = {
  getUserWithEmail(db, email) {
    return db("users").where("users.email", email).first();
  },

  checkUserExists(db, id) {
    return db("users").where({ email }).first();
  },

  createUser(db, email) {
    return db
      .insert(email)
      .into("users")
      .returning("*")
      .where("users.email", email);
  },
};

module.exports = AuthService;
