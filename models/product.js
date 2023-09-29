const fs = require('fs')
const path = require('path')


 // Construct the path to the products.json file
 const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

  module.exports = class Product {
    constructor(title, price) {
      this.title = title;
    this.price = price;
    }

  save() {
    fs.readFile(filePath, (err, fileContent) => {
      let products = []
      if(!err) {
        products = JSON.parse(fileContent)
      }
      products.push(this)
      //write the data to json
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.error(err);
      })
    })
  }
  static fetchAll() {
    return new Promise((resolve, reject) => {
      // Read the file asynchronously
      fs.readFile(filePath, (err, fileContent) => {
        // If there's an error reading the file, reject the Promise with the error
        if (err) {
          reject(err);
        } else {
          // If successful, parse the JSON data and resolve the Promise with the parsed data
          resolve(JSON.parse(fileContent));
        }
      });
    });
  }
}