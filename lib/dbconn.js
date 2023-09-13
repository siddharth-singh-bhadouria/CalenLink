const mysql = require("mysql2");

const connection = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(() => {
  console.log("DATABASE CONNECTED!!");
});

module.exports = connection;
