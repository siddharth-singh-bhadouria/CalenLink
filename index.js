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
const crypto = require("crypto");
const mysql = require("mysql2");
const User = require("./models/users");

const userRoutes = require("./routes/users");
const pageRoutes = require("./routes/pages");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(() => {
  console.log("DATABASE CONNECTED!!");
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
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Specify the field used for the username
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Here, you would typically compare the provided password with the hashed password stored in the database
        // If the passwords match, call done(null, user), otherwise, call done(null, false)

        // Example (assuming you're using a library like bcrypt for password hashing):
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (isValidPassword) {
        //   return done(null, user);
        // } else {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});

app.use("/", pageRoutes);
app.use("/", userRoutes);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`LISTENING TO PORT ${port}!!`);
});
