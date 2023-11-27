const Product = require("../models/product");
const formatCurrency = require("../util/formatCurrency");

exports.getAddProduct = (req, res, next) => {
  // const cookieString = req.get("Cookie");
  // const isAuth = cookieString?.split("=")[1];
  res.render("admin/edit-product", {
    docTitle: "Home Shop",
    path: "/admin/add-product",
    editing: false,
    isAuth: req.session.isAuth,
  });
};

exports.addAnewProducts = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const product = new Product({
    title: title,
    price: price,
    imgUrl: imgUrl,
    description: description,
    userId: req.session.user,
  });

  product
    .save()
    .then(() => {
      console.log("success, creating product");
      res.redirect("/admin/add-product");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  // const cookieString = req.get("Cookie");
  // const isAuth = cookieString?.split("=")[1];
  const editMode = req.query.edit;
  const prodId = req.params.id;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuth: req.session.isAuth,
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
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.description = updateDescription;
      product.price = updatedPrice;
      product.imgUrl = updatedImgURL;
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
  // const cookieString = req.get("Cookie");
  // const isAuth = cookieString?.split("=")[1];
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        formatCurrency: formatCurrency,
        isAuth: req.session.isAuth,
      });
    })
    .catch();
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};
