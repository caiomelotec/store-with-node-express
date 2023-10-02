const Product = require("../models/product");
const formatCurrency = require('../util/formatCurrency')


exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
    editing: false
  });
};

exports.addAnewProducts = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const product = new Product(title, price, description, imgUrl, null);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.id

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(prodId).then((product) => {
    if(!product){
      res.redirect("/")
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  })
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.id;
  Product.delete(prodId)
  res.redirect('/admin/products');
}

exports.postEditProduct = (req, res) => {
    const prodId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImgURL = req.body.imgUrl;
    const updateDescription = req.body.description;
    const updatedProduct = new Product(
      updatedTitle,
      updatedPrice,
      updateDescription,
      updatedImgURL,
      prodId);
    updatedProduct.save();
    res.redirect('/admin/products')
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll(); // fetches the list of products
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
      formatCurrency: formatCurrency
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
};
