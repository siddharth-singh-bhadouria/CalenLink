// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const express = require("express");
// const app = express();
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const crypto = require("crypto");
// const mysql = require("mysql2");
// const User = require("./models/users");
// const { Sequelize } = require("sequelize");
// const connection = require("./lib/dbconn");
// const flash = require("connect-flash");

// const userRoutes = require("./routes/users");
// const pageRoutes = require("./routes/pages");

// // db.query(
// //   `insert into user(username,email,password) values ('sid','sid@s','sid')`,
// //   (err, result, fields) => {
// //     if (err) {
// //       return console.log(err);
// //     } else {
// //       return console.log(result);
// //     }
// //   }
// // );

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// const secret = process.env.SECRET || "thisshouldbeabettersecret";

// app.use(
//   session({
//     secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       httpOnly: true,
//       // secure: true,
//       expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
//   })
// );

// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   "local",
//   new LocalStrategy(
//     {
//       usernameField: "username",
//       passwordField: "password",
//       passReqToCallback: true, //passback entire req to call back
//     },
//     function (req, username, password, done) {
//       if (!username || !password) {
//         return done(
//           null,
//           false,
//           req.flash("message", "All fields are required.")
//         );
//       }
//       const salt = "7fa73b47df808d36c5fe328546ddef8b9011b2c6";
//       connection.query(
//         "select * from tbl_users where username = ?",
//         [username],
//         function (err, rows) {
//           console.log(err);
//           console.log(rows);
//           if (err) return done(req.flash("message", err));
//           if (!rows.length) {
//             return done(
//               null,
//               false,
//               req.flash("message", "Invalid username or password.")
//             );
//           }
//           salt = salt + "" + password;
//           const encPassword = crypto
//             .createHash("sha1")
//             .update(salt)
//             .digest("hex");
//           const dbPassword = rows[0].password;
//           if (!(dbPassword == encPassword)) {
//             return done(
//               null,
//               false,
//               req.flash("message", "Invalid username or password.")
//             );
//           }
//           return done(null, rows[0]);
//         }
//       );
//     }
//   )
// );
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });
// passport.deserializeUser(function (id, done));
// });

// app.use("/", pageRoutes);
// app.use("/", userRoutes);

// const port = process.env.port || 3000;

// app.listen(port, () => {
//   console.log(`LISTENING TO PORT ${port}!!`);
// });

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/users"); // Import your User model
const bodyParser = require("body-parser");
const session = require("express-session");
const Sequelize = require("sequelize");
const ejsMate = require("ejs-mate");

const userRoutes = require("./routes/users");
const pageRoutes = require("./routes/pages");

const app = express();
const port = process.env.DB_PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configure the Sequelize connection to your MySQL database
const sequelize = new Sequelize(
  `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);

// Define the User model
const UserModel = sequelize.define("User", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Sync the User model with the database (creates the "users" table if it doesn't exist)
sequelize
  .sync()
  .then(() => {
    console.log("Database is synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Configure Passport to use the LocalStrategy
passport.use(
  new LocalStrategy((username, password, done) => {
    UserModel.findOne({ where: { username: username } })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  })
);

// Serialize and deserialize user (needed for session management)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRoutes);
app.use("/", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
