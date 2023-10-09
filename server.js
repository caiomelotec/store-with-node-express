const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
console.log(process.env);

// Models
const Product = require("./models/product");
const User = require("./models/user");

// Middleware to fetch a user
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Relationships
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// DB
const sequelize = require("./util/database");

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

// DB synchronization and server listening
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Caio",
        email: "caio@example.com",
      });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(port);
  })
  .catch((err) => console.log(err));
