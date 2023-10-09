const Sequelize = require("sequelize");

const sequelize = require("sequelize");

const CartItem = sequelize.define("cart_item", {
  id: {
    type: Sequelize.STRING,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  quantity: Sequelize.INTEGER,
});
module.exports = CartItem;
