const express = require("express");
// const path = require("path");
// const rootDir = require("../util/path");
const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
    productCss: true,
    addProductCss: true,
    activeShop: false,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body.title);
  products.push({ title: req.body.title });
  // res.send(`<h1>the product name's : ${req.body.title}</h1>`);
  res.redirect("/"); // Redirect to the homepage
});

exports.routes = router;
exports.products = products;
