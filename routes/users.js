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
      failureFlash: true,
      failureRedirect: "/login",
    }),
    (req, res) => {
      const redirectUrl = "/pages/scheduledEvents";
      res.redirect(redirectUrl);
    }
  );
// .post(catchAsync(users.login))

// router.route('/logout')
//     .get(users.logout)

module.exports = router;
