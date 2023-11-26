const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const User = require("./models/user");
const mongoose = require("mongoose");

app.use((req, res, next) => {
  User.findById("6562e11c104e1410408d23b8")
    .then((user) => {
      req.user = user;
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
mongoose
  .connect(
    `mongodb+srv://caiomelo:${process.env.PASSWORD}@caiocluster.infg9q7.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then((result) => {
    // const user = new User({
    //   username: "caio-admin",
    //   email: "admincaio@gmail.com",
    //   cart: {
    //     items: [],
    //   },
    // });
    // user.save();
    app.listen(port);
  })
  .catch((err) => console.error(err));
