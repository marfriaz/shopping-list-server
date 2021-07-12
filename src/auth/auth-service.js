const AuthService = {
  getUserWithEmail(db, email) {
    return db("users").where("users.email", email).first();
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
