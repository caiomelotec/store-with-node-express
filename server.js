const express = require("express");
const path = require("path");
const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
console.log(process.env);

//DB
const db = require("./util/database");
// EJS
app.set("view engine", "ejs");
app.set("views", "views");

const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// acess to the public folder
app.use(express.static(path.join(__dirname, "public")));
//routers
app.use("/admin", adminRoutes);
app.use(shopRouter); // home
//DB TESTING CODE
// db.execute("SELECT * FROM products")
//   .then((result) => console.log(result[0]))
//   .catch((err) => console.log(err));
// // error page
// app.use((req, res, next) => {
//   res.status(404).render("page-not-found", { docTitle: "Page not Found" });
// });

// listening
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
