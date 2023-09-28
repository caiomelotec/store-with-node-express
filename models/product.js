const products = []

module.exports = class Product {
  constructor(t, p) {
    this.title = t
    this.price = p
  }

  save() {
    products.push(this)
  }
  static fetchAll() {
    return products
  }
}