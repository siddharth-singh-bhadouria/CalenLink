const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mysql = require("mysql2");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

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

const userRoutes = require("./routes/users");
const pageRoutes = require("./routes/pages");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const secret = "thisshouldbeabettersecret";

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

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    // Query the database to find a user with the given username
    db.query(
      "SELECT * FROM user WHERE username = ?",
      [username],
      (err, results) => {
        if (err) return done(err);

        if (!results || results.length === 0) {
          return done(null, false, { message: "Incorrect username." });
        }

        const user = results[0];

        // Verify the password
        if (password !== user.password) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      }
    );
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM user WHERE id = ?", [id], (err, results) => {
    if (err) return done(err);

    const user = results[0];
    done(null, user);
  });
});

app.use("/", pageRoutes);
app.use("/", userRoutes);

// // READ
// app.get("/users", (req, res) => {
//   let sql = "SELECT * FROM users";
//   db.query(sql, (err, results) => {
//     if (err) throw err;
//     res.send(results);
//   });
// });

// // UPDATE
// app.put("/update/:id", (req, res) => {
//   let sql = `UPDATE users SET name = '${req.body.name}', age = '${req.body.age}' WHERE id = ${req.params.id}`;
//   db.query(sql, (err, results) => {
//     if (err) throw err;
//     res.send("User updated.");
//   });
// });

// // DELETE
// app.delete("/delete/:id", (req, res) => {
//   let sql = `DELETE FROM users WHERE id = ${req.params.id}`;
//   db.query(sql, (err, results) => {
//     if (err) throw err;
//     res.send("User deleted.");
//   });
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
