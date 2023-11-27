const Product = require("../models/product");
// const Cart = require("../models/cart");
const Order = require("../models/order");
const formatCurrency = require("../util/formatCurrency");

exports.getProducts = (req, res) => {
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        formatCurrency: formatCurrency,
        isAuth: isAuth,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductId = (req, res) => {
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  const prodId = req.params.id;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product, // Pass the retrieved product to the view
        docTitle: product.title,
        path: "/products",
        formatCurrency: formatCurrency,
        isAuth: isAuth,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Home Shop",
        path: "/",
        formatCurrency: formatCurrency,
        isAuth: isAuth,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        docTitle: "Shopping Cart",
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        path: "/cart",
        isAuth: isAuth,
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
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
    isAuth: isAuth,
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
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        orders: orders,
        docTitle: "Your Orders",
        path: "/orders",
        isAuth: isAuth,
      });
    })
    .catch((err) => {
      console.log("Error fetching orders:", err);
    });
};
