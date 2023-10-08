const Cart = require("./cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(title, price, description, imgUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
    this.id = id;
  }

  save() {}

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {}
};
