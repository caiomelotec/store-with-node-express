const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

app.use((req, res, next) => {
  User.findUserById("655c151e84ce500ecbba3745")
    .then((user) => {
      // Attach the user to the request object
      req.user = new User(user.username, user.email, user.cart, user._id);

      console.log("User", user);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

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

// connecting to mongodb
mongoConnect(() => {
  // if()
  app.listen(port);
});
