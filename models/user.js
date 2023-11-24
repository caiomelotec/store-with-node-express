const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    if (this.id) {
      db.collection("users").updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { username: this.username, email: this.email } }
      );
    } else {
      db.collection("users").insertOne(this);
    }
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items
      ? this.cart.items.findIndex(
          (cp) => cp.productId.toString() === product._id.toString()
        )
      : -1;

    let newQuantity = 1;

    const updatedCartItems = this.cart.items ? [...this.cart.items] : [];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productsIds = this.cart.items.map((item) => item.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productsIds } })
      .toArray()
      .then((products) =>
        products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === product._id.toString();
            }).quantity,
          };
        })
      );
  }

  static findUserById(id) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = User;
