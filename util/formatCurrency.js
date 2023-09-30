const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
  currency: "EUR",
  style:"currency"
})

const formatCurrency = (number) => {
  return CURRENCY_FORMATTER.format(number)
}

module.exports = formatCurrency
 