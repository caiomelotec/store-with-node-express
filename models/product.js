const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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
};

module.exports = class Product {
  constructor(title, price, description, imgUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
    this.id = this.id = id || uuidv4(); // Generate a new UUID if not provided;
  }

  save() {
    // Read the existing product data from the file
    fs.readFile(filePath, (err, fileContent) => {
      let products = [];
      // Check if there was no error while reading the file
      if (!err) {
        // Parse the JSON content from the file into the 'products' array
        products = JSON.parse(fileContent);
      }
      // Check if the product already exists based on its ID
      const existingProductIndex = products.findIndex(
        (product) => product.id === this.id
      );

      if (existingProductIndex !== -1) {
        // If the product exists, update it
        products[existingProductIndex] = this;
      } else {
        // If the product doesn't exist, add it with a new ID
        this.id = uuidv4();
        // Add the current product instance ('this') to the 'products' array
        products.push(this);
      }

      // Write the updated 'products' array back to the file
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.error(err);
      });
    });
  }

  static delete(id) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.error("Error reading product file:", err);
        return;
      }

      let products = [];

      try {
        products = JSON.parse(fileContent);
      } catch (parseError) {
        console.error("Error parsing product JSON:", parseError);
        return;
      }
      // Find the index of the product to be deleted
      const existingProductIndex = products.findIndex((product) => {
        return id === product.id;
      });

      if (existingProductIndex !== -1) {
        // If the product exists, remove it from the 'products' array
        products.splice(existingProductIndex, 1);
        // Write the updated 'products' array back to the file
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            console.error("Error writing product file:", err);
          }
        });
      }
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
        return product.id === id;
      });
      if (product) {
        return product;
      } else {
        throw new Error("Product not Found");
      }
    } catch (err) {
      throw err;
    }
  }
};
