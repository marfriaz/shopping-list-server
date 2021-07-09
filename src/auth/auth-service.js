const AuthService = {
  getUserWithEmail(db, email) {
    return db("users").where({ email }).first();
  },

  createUserIfDoesNotExist(db, email) {
    ///NNEEEDS UPSERT
    return db
      .insert(email)
      .into("users")
      .returning("*")
      .where("users.email", email);
  },
};

module.exports = AuthService;
