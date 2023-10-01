const Product = require("../models/product");


exports.getCart = (req, res) => {
  res.render("shop/cart", {
    docTitle:"Shopping Cart",
    path:"/cart"
  })
}
exports.postCart = (req, res) => {
  const prodId = req.body.productId
  console.log(prodId);
  // res.render("shop/cart", {
  //   docTitle:"Shopping Cart",
  //   path:"/cart"
  // })
  res.redirect('/cart')
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

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    docTitle:"Your Orders",
    path:"/orders"
  })
}
// Use Product.findById to retrieve the product by ID
exports.getProductId = (req, res) => {
const prodId = req.params.id;
Product.findById(prodId).then(product => {
  if(product) {
    res.render('shop/product-detail', {
      product: product, // Pass the retrieved product to the view
      docTitle: product.title,
      path: '/products'})
  }
})
}
