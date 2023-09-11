const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);

const userSchema = sequelize.define("User", {
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = userSchema;
