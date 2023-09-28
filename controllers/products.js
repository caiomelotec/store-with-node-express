const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
    productCss: true,
    addProductCss: true,
    activeShop: false,
    activeAddProduct: true,
  });
}

exports.addAnewProducts = (req, res, next) => {
  const product = new Product(req.body.title, req.body.price)
  product.save()

  res.redirect("/"); 
}


exports.getProducts = (req, res) => {
  const products = Product.fetchAll()
  res.render("shop", {
    prods: products,
    docTitle: "Home Shop",
    path: "/",
    productsCondition: products.length > 0,
  });
}

