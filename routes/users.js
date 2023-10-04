const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");

router.route("/register").get(users.renderRegister).post(users.register);

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      successRedirect: "/scheduledEvents",
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Welcome Back!");
      // const redirectUrl = res.locals.returnTo || "/scheduledEvents";
      // delete res.locals.returnTo
      // res.redirect(redirectUrl);
    }
  );
// .post(catchAsync(users.login))

// router.route('/logout')
//     .get(users.logout)

module.exports = router;
