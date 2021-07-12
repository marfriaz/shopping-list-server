const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");

// db is set to a knex config object. Knex is SQL query builder library for Node and Postgres
const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});

// Express instance sets "db" as our knex object
app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
