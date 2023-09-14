const User = require("../models/users");
const passport = require("passport");
const flash = require("connect-flash");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/pages/home");
    });
  } catch (e) {
    res.redirect("/users/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};
