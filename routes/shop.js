const express = require("express");

const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:id", shopController.getProductId);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/cart/delete", shopController.postDeleteProductFromCart);
router.get("/orders", shopController.getOrders);
router.get("/checkout", shopController.getCheckOut);

module.exports = router;
