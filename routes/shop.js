
const express = require("express");

const router = express.Router();
const shopController = require('../controllers/shop')


router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts)
router.get("/checkout", shopController.getCheckOut)
router.get("/cart", shopController.getCart)

module.exports = router;
