const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/services", (req, res) => {
  res.render("pages/services");
});

app.get("/contact", (req, res) => {
  res.render("pages/contact");
});

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.get("/register", (req, res) => {
  res.render("users/register");
});

app.listen(3000, () => {
  console.log("LISTENING TO PORT 3000!!");
});
