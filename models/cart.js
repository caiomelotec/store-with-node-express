const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.error("Error reading cart file:", err);
        return;
      }

      let cart = { products: [], totalPrice: 0 };

      if (fileContent && fileContent.length > 0) {
        try {
          cart = JSON.parse(fileContent);
        } catch (parseError) {
          console.error("Error parsing cart JSON:", parseError);
          return;
        }
      }

      // Ensure that cart.products is an array
      cart.products = cart.products || [];

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex !== -1) {
        // If the product already exists in the cart, update its quantity
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // If it's a new product, add it to the cart
        cart.products.push({ id: id, quantity: 1 });
      }

      // Calculate the total price by summing the productPrice multiplied by quantity
      cart.totalPrice = cart.products.reduce((total, product) => {
        return total + product.quantity * productPrice;
      }, 0);

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        if (err) {
          console.error("Error writing cart file:", err);
        }
      });
    });
  }
}

module.exports = Cart;
