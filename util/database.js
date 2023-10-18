require("dotenv").config();

const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  MongoClient.connect(
    `mongodb+srv://caiomelo:${process.env.PASSWORD}@caiocluster.infg9q7.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("Connected to MongoDB");
      cb(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
