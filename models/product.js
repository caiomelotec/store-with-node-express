const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
// Construct the path to the products.json file
const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = () => {
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

module.exports = class Product {
  constructor(title, price, description, imgUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description
    this.imgUrl = imgUrl
    this.id = id
  }

  save() {
    // Read the existing product data from the file
    this.id = uuidv4()
    fs.readFile(filePath, (err, fileContent) => {
      let products = [];
      // Check if there was no error while reading the file
      if (!err) {
        // Parse the JSON content from the file into the 'products' array
        products = JSON.parse(fileContent);
      }
      // Add the current product instance ('this') to the 'products' array
      products.push(this);
      // Write the updated 'products' array back to the file
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.error(err);
      });
    });
  }
  static async fetchAll() {
    try {
      return await getProductsFromFile();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const products = await getProductsFromFile();
      const product = products.find((product) => {
        return product.id === id
      })
      if(product) {
        return product
      } else {
        throw new Error('Product not Found')
      }
    } catch(err){
      throw err
    }
  }
};
