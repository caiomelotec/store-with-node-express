const Product = require("../models/product");
// const Cart = require("../models/cart");
const Order = require("../models/order");
const formatCurrency = require("../util/formatCurrency");

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        formatCurrency: formatCurrency,
        isAuth: req.session.isAuth,
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
        isAuth: req.session.isAuth,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Home Shop",
        path: "/",
        formatCurrency: formatCurrency,
        isAuth: req.session.isAuth,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  if (!req.session.user) {
    return res.render("shop/cart", {
      docTitle: "Shopping Cart",
      path: "/cart",
      products: [],
      path: "/cart",
      isAuth: req.session.isAuth,
    });
  }
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items || [];
      res.render("shop/cart", {
        docTitle: "Shopping Cart",
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        path: "/cart",
        isAuth: req.session.isAuth,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  if (!req.session.user) {
    return res.redirect("/login");
  }

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error adding product to cart:", error);
      res.redirect("/");
    });
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
    isAuth: req.session.isAuth,
  });
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });

      const order = new Order({
        user: {
          name: req.user.username,
          userId: req.user,
        },
        products: products,
      });

      return order.save();
    })
    .then(() => {
      req.user.clearCart();
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.session.user?._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders: orders,
        docTitle: "Your Orders",
        path: "/orders",
        isAuth: req.session.isAuth,
      });
    })
    .catch((err) => {
      console.log("Error fetching orders:", err);
    });
};
