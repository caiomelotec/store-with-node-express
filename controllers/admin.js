const { redirect } = require("react-router-dom");
const Product = require("../models/product");
const formatCurrency = require("../util/formatCurrency");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.addAnewProducts = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;

  // Check if req.user is defined before accessing its properties
  if (!req.user) {
    return res.status(401).send("Unauthorized"); // Handle unauthorized access
  }
  req.user
    .createProduct({
      title: title,
      price: price,
      description: description,
      imgUrl: imgUrl,
    })
    .then(() => {
      console.log("success, creating product");
      res.redirect("/admin/add-product");
    })
    .catch((err) => {
      console.log(err);
      // Handle the error appropriately
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.id;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgURL = req.body.imgUrl;
  const updateDescription = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imgUrl = updatedImgURL;
      product.description = updateDescription;
      return product.save();
    })
    .then(() => {
      console.log("success, updating product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        formatCurrency: formatCurrency,
      });
    })
    .catch();
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.id;
  Product.destroy({ where: { id: prodId } }).then(() => {
    res.redirect("/admin/products");
  });
};
