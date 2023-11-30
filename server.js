const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
const csrf = require("csurf");
const flash = require("connect-flash");
const app = express();

// Set up session store
const store = new MongoDBStore({
  uri: `mongodb+srv://caiomelo:${process.env.PASSWORD}@caiocluster.infg9q7.mongodb.net/shop`,
  collection: "sessions",
  expires: 12 * 60 * 60 * 1000, // 12h in milliseconds
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Access to the public folder
app.use(express.static(path.join(__dirname, "public")));

// Use session middleware
app.use(
  session({
    secret: "adgasgdi127812r6v!a4!5!74",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// CSRF protection middleware
const csrfProtection = csrf();
app.use(csrfProtection);
// flash
app.use(flash());
// Custom middleware to load user from session
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next(); // Make sure to call next() here
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

// Set up view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Make csrfToken available globally
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuth = req.session.isAuth;
  next();
});

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Use routers
app.use("/admin", adminRoutes);
app.use(shopRoutes); // Home
app.use(authRoutes);

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://caiomelo:${process.env.PASSWORD}@caiocluster.infg9q7.mongodb.net/shop`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error(err));
