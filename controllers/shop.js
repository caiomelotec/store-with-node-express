const Product = require("../models/product");
const Cart = require("../models/cart.js");
const formatCurrency = require("../util/formatCurrency");

exports.getProducts = (req, res) => {
  Product.findAll()
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

// Use Product.findById to retrieve the product by ID
//Get Product
exports.getProductId = (req, res) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then(([product, fieldData]) => {
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
  Product.findAll()
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
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then(([products, fieldData]) => {
        const cartProducts = [];
        for (const product of products) {
          const cartProductData = cart.products.find(
            (prod) => prod.id === product.id
          );
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }
        res.render("shop/cart", {
          docTitle: "Shopping Cart",
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
          path: "/cart",
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.id;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
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
