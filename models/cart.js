const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

class Cart {
  static addProduct(id, productPrice) {
    // Read the cart data from the file
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      // Check if there was no error reading the file
      if (!err) {
        // Parse the existing cart data from the file content
        cart = JSON.parse(fileContent);
      }

      // Analyze the cart => Find existing product in the cart by ID
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );

      // Get the existing product, if found
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product or increase quantity if it already exists
      if (existingProduct) {
        // Create a copy of the existing product to update
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;

        // Update the cart products array with the modified product
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // If the product doesn't exist in the cart, add it with a quantity of 1
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      // Update the total price in the cart
      cart.totalPrice = cart.totalPrice + +productPrice;

      // Write the updated cart data back to the file
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err); // Log any errors encountered during file write
      });
    });
  }


  static deleteProduct(id, productPrice) {
    // Read the cart data from the file
    fs.readFile(filePath, (err, fileContent) => {
      // Check if there was an error reading the file
      if (err) {
        return; // If there's an error, return and do nothing
      }

      // Create a copy of the existing cart data from the file content
      const updatedCart = { ...JSON.parse(fileContent) };

      // Find the product to be deleted by its ID
      const product = updatedCart.products.find((prod) => prod.id === id);

      // Check if the product with the given ID exists in the cart
      if (!product) {
        // Product not found, handle this case accordingly
        console.error(`Product with ID ${id} not found in the cart.`);
        return; // Return without further processing
      }

      // Get the quantity of the product to be deleted
      const productQty = product.qty;

      // Remove the product with the given ID from the cart
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );

      // Update the total price in the cart by subtracting the removed product's price
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      // Write the updated cart data back to the file
      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        console.log(err); // Log any errors encountered during file write
      });
    });
  }


  static getCart(cb) {
    // Read the cart data from the file
    fs.readFile(filePath, (err, fileContent) => {
      // Parse the cart data from the file content
      const cart = JSON.parse(fileContent);

      // Check if there was an error reading the file
      if (err) {
        cb(null); // If there's an error, pass null to the callback
      } else {
        cb(cart); // Otherwise, pass the cart data to the callback
      }
    });
  }

}

module.exports = Cart;
