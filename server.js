const express = require("express");
const path = require("path");
const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");
const bodyParser = require("body-parser");
const app = express();

// EJS
app.set("view engine", "ejs");
app.set("views", "views");
//  handlebars
// const expressHbs = require("express-handlebars");
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );

// app.set("view engine", "hbs");
// app.set("views", "views");
// PUG
// app.set("view engine", "pug");
// app.set("views", "views");

const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// acess to the public folder
app.use(express.static(path.join(__dirname, "public")));
//routers
app.use("/admin", adminData.routes);
app.use(shopRouter); // home

// error page
app.use((req, res, next) => {
  res.status(404).render("page-not-found", { docTitle: "Page not Found" });
});

// listening
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
