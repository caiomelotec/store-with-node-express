const Product = require("../models/product");
const formatCurrency = require("../util/formatCurrency");

exports.getAddProduct = (req, res, next) => {
  if (req.session.isAuth) {
    return res.render("admin/edit-product", {
      docTitle: "Home Shop",
      path: "/admin/add-product",
      editing: false,
      isAuth: req.session.isAuth,
    });
  } else {
    return res.redirect("/login");
  }
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
      throw new Error("Creating a new product fail", err);
    });
};

exports.getEditProduct = (req, res, next) => {
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
    .catch((err) => {
      throw new Error("Get editing product fail", err);
    });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgURL = req.body.imgUrl;
  const updateDescription = req.body.description;
  console.log(req.session.user._id.toString());
  Product.findById(prodId)
    .then((product) => {
      console.log("product.userid:", product.userId.toString());
      if (product.userId.toString() !== req.session.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.description = updateDescription;
      product.price = updatedPrice;
      product.imgUrl = updatedImgURL;
      return product.save().then(() => {
        console.log("success, updating product");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      throw new Error("Editing a product fail", err);
    });
};

exports.getProducts = (req, res) => {
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
    .catch((err) => {
      throw new Error("Get products fail", err);
    });
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.session.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      throw new Error("Deleting a product fail", err);
    });
};
