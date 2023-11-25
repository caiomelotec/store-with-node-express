const Product = require("../models/product");
// const Cart = require("../models/cart");
// const Order = require("../models/order");
const formatCurrency = require("../util/formatCurrency");

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        formatCurrency: formatCurrency,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductId = (req, res) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product, // Pass the retrieved product to the view
        docTitle: product.title,
        path: "/products",
        formatCurrency: formatCurrency,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Home Shop",
        path: "/",
        formatCurrency: formatCurrency,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        docTitle: "Shopping Cart",
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
    });

  res.redirect("/");
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.id;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckOut = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
  });
};

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        orders: orders,
        docTitle: "Your Orders",
        path: "/orders",
      });
    })
    .catch((err) => {
      console.log("Error fetching orders:", err);
    });
};
