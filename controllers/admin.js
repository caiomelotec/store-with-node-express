const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
  });
};

exports.addAnewProducts = (req, res, next) => {
  const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imgUrl);
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
};