require("dotenv").config();

module.exports = {
  migrationDirectory: "migrations",
  driver: "pg",
  connectionString:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_URL
      : "postgresql://shopping-list-user@localhost/shopping-list",
  // ssl: { rejectUnauthorized: false, strictSSL: false },
};
