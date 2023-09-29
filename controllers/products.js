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

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll(); // fetches the list of products
    res.render("shop", {
      prods: products,
      docTitle: "Home Shop",
      path: "/",
      productsCondition: products.length > 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
};