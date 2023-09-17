const express = require("express");
const app = express();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sid20302",
  database: "calenlink",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL.");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
