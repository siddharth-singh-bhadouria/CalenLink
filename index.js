if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "your-mysql-host",
  user: "your-username",
  password: "your-password",
  database: "your-database-name",
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET || "thisshouldbeabettersecret";

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
