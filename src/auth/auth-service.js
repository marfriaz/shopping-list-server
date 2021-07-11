const AuthService = {
  getUserWithEmail(db, email) {
    return db("users").where("users.email", email).first();
  },

  checkUserExists(db, id) {
    return db("users").where({ email }).first();
  },

  createUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .where("users.email", newUser.email);
  },
};

module.exports = AuthService;
