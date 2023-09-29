const Product = require("../models/product");


exports.getCart = (req, res) => {
  res.render("shop/cart", {
    docTitle:"Shopping Cart",
    path:"/cart"
  })
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll(); // fetches the list of products
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
};

exports.getIndex = async (req, res) => {
  try {
    const products = await Product.fetchAll(); // fetches the list of products
    res.render("shop/index", {
      prods: products,
      docTitle: "Home Shop",
      path: "/",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
};

exports.getCheckOut = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout'
  })
}