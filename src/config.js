module.exports = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://shopping-list-user@localhost/shopping-list",
};
