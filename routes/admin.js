const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();
const isAuth = require("../util/isAuth");
const csrf = require("csurf");
const csrfProtection = csrf();
//admin/products
router.get("/products", adminController.getProducts);

// admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);
// // admin/add-product => POST
router.post("/add-product", isAuth, adminController.addAnewProducts);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
