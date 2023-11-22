const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
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

  static findUserById(id) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = User;
