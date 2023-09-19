const mysql = require("mysql2");
const passport = require("passport");
const flash = require("connect-flash");

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

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

function generateComplexId() {
  const timestamp = new Date().getTime().toString(16);
  const randomValue = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomValue}`;
}

module.exports.register = async (req, res) => {
  let data = {
    id: generateComplexId(),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };
  let sql = "INSERT INTO user SET ?";
  db.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send("User added.");
  });
  return res.redirect("/scheduledEvents");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};
