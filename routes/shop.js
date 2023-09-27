const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  // console.log(adminData.products);
  const products = adminData.products;
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render("shop", {
    prods: products,
    docTitle: "Home Shop",
    path: "/",
    productsCondition: products.length > 0,
  });
});

module.exports = router;
