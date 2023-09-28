const products = [];

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
  console.log(req.body.title);
  products.push({ title: req.body.title });
;
  res.redirect("/"); 
}


exports.getProducts = (req, res) => {
  res.render("shop", {
    prods: products,
    docTitle: "Home Shop",
    path: "/",
    productsCondition: products.length > 0,
  });
}

exports.products = products;