const express = require("express");
const isAuth = require("../util/isAuth");
const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:id", shopController.getProductId);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
// checkout
router.get("/checkout", isAuth, shopController.getCheckOut);
router.get("/checkout/success", shopController.getCheckOutSuccess);
router.get("/checkout/cancel", shopController.getCheckOut);
//
// router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
