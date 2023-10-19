require("dotenv").config();

const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    `mongodb+srv://caiomelo:${process.env.PASSWORD}@caiocluster.infg9q7.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("Connected to MongoDB");
      db = client.db();
      cb();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw new Error("DB not connected");
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
