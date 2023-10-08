require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "store",
  password: process.env.PASSWORD,
});

module.exports = pool.promise();
