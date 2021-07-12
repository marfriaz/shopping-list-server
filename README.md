# Google Project: Shopping-List

## Description

I built a fullstack webapp that provides users with the following abilities:

- User is able to add an item to the shopping list
- User is able to view their whole shopping list
- User is able to delete an individual item from the shopping list
- User is able to delete their entire shopping list, with a single button click (without going and deleting each individual item one by one)
- Each user is able to login with their Google account and their shopping list persists between their logins

The app was built using React.js for the Web-Client, Node.js for the Web-Server and PostgreSql for the database.

The app works as:

1. User logins in via the Google oAUth Log-in Component for React (npm react-google-login).
2. Google oAuth returns a tokenId.
3. The Web Server authenticates the tokenId via Google's node.js client library for authentication (npm google-auth-library):

- If successful, Google returns the user's credentials. The Web Server checks if the user exists in the Postgres database by matching email. If not, the user (email and name) is added to database. The Web Server returns the authenticated token to the Web Client. The Web Client stores the token in local storage to make subsequent HTTP requests to the server.
- If unsuccessful, the server returns a Google Authentication Failure error.

4. When logged in, the user may:

- View items in their shopping list (GET request)
- Add items to shopping list (POST request)
- Delete an item from the shopping list (DELETE request)
- Delete all items from the shopping list (DELETE request)

5. All HTTP requests are first authenticated by the checkAuthenticated middleware (process above^).

- If auth is successful, the server makes a database transaction via Knex (a SQL query builder library) and returns a response to the Web Client.
- If auth is unsuccessful, the server returns a Google Authentication Failure error. The Web Client will sign the user out.

## Prereqs

1. Please ensure you have the latest version of Node downloaded.

- To check if already downloaded, from terminal: node -v
- To install, visit [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

2. Please ensure you have the latest version of Postgresql downloaded (https://www.postgresql.org/download/)

- For quick setup, you may: 1. Download [Homebrew] (https://brew.sh/) 2. Type in Command Line: brew update 3. brew install postgresql
- To start Postgres server, Type in Command Line: pg_ctl -D /usr/local/var/postgres start. To start Postgres server, Type in Command Line: pg_ctl -D /usr/local/var/postgres stop.

## Setup

1. Setup Postgres database

   1. To start Postgres server, Type in Command Line: pg_ctl -D /usr/local/var/postgres start
   2. To create a Postgres super user, Type in Command Line: createuser -Pw --interactive
   3. To create a Postgres database, Type in Command Line: createdb -U "super user name" "database name"

   - Example: createdb -U shopping-list-admin shopping-list

2. Setup Web-Server:

   1. From terminal, cd into shopping-list-server directory
   2. Install dependencies (npm install)
   3. From config.js, update DATABASE_URL to the postgres database URL you created (in Prereqs^). Format should be in "postgresql://"database user name"@localhost/"database name"

   - Example: "postgresql://shopping-list-user@localhost/shopping-list"

   4. Type in Command Line: npm run migrate. This will create the database tables using a Node.js SQL migration library (npm postgrator) using the SQL scripts from the "Migrations" folder.
   5. Run the server by running 'npm start'.

3. Set up Web-Client:

   1. From terminal, cd into shopping-list-home-client directory
   2. Install dependencies (npm install)
   3. Run the client by running 'npm start'. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
