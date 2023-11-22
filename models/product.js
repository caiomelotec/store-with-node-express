const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imgUrl, description, id, userId, username) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
    this.username = username;
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      // update
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection("products").insertOne(this);
    }
    return dbOperation
      .then((result) => console.log(result))
      .catch((err) => {
        console.error(err);
        throw err; // Rethrow the error
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.error(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => product)
      .catch((err) => console.error(err));
  }

  static deleteProduct(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((product) => product)
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
