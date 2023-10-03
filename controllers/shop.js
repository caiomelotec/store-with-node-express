const Product = require("../models/product");
const Cart = require("../models/cart.js");
const formatCurrency = require("../util/formatCurrency");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
      formatCurrency: formatCurrency,
    });
  }); // fetches the list of products
};

// Use Product.findById to retrieve the product by ID
//Get Product
exports.getProductId = (req, res) => {
  const prodId = req.params.id;
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product, // Pass the retrieved product to the view
      docTitle: product.title,
      path: "/products",
      formatCurrency: formatCurrency,
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Home Shop",
      path: "/",
      formatCurrency: formatCurrency,
    });
  });
};

exports.getCart = (req, res) => {
  res.render("shop/cart", {
    docTitle: "Shopping Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getCheckOut = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};
