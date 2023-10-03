const express = require("express");
const path = require("path");
// const rootDir = require("../util/path");
const productsController = require("../controllers/shop");
const adminController = require("../controllers/admin");
const router = express.Router();

//admin/products
router.get("/products", adminController.getProducts);

// admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);
// admin/add-product => POST
router.post("/add-product", adminController.addAnewProducts);

router.get("/edit-product/:id", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
