require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize("store", "root", process.env.PASSWORD, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
// const mysql = require("mysql2");

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "store",
//   password: process.env.PASSWORD,
// });

// module.exports = pool.promise();
