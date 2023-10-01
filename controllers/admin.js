const Product = require("../models/product");
const formatCurrency = require('../util/formatCurrency')


exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
  });
};

exports.addAnewProducts = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const product = new Product(title, price, description, imgUrl);
  product.save();
  res.redirect("/");
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll(); // fetches the list of products
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
      formatCurrency: formatCurrency
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
};
