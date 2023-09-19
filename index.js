const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "sid20302",
//   database: "calenlink",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL.");
// });

const userRoutes = require("./routes/users");
const pageRoutes = require("./routes/pages");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
