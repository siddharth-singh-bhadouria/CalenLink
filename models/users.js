// models/User.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "calenlink",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Other user-related fields can be defined here
});

// ...

module.exports = User;
