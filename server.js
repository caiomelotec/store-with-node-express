const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
// console.log(process.env);

// Middleware to fetch a user
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
});

// Relationships

// DB

// EJS
app.set("view engine", "ejs");
app.set("views", "views");

const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Access to the public folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

// Routers
app.use("/admin", adminRoutes);
app.use(shopRouter); // home
