'use strict'

const generateOrder = require('../util/generate_order')

module.exports = (args = {}) => {
  const { sliceInterval, amount } = args
  const m = amount < 0 ? -1 : 1
  const startTS = Date.now()
  const orders = []

  let remAmount = Math.abs(amount)
  let o
  let ts = Date.now()
  let delay

  while (remAmount > 0) {
    o = generateOrder({
      remainingAmount: remAmount * m,
      args
    }, 'PRICE')

    if (o === null) {
      break
    }

    o.amount = Math.min(Math.abs(o.amount), remAmount) * m
    remAmount -= Math.abs(o.amount)

    orders.push(o)

    // Convert duration to timeout
    let currIntervalPos = ((ts - startTS) / sliceInterval)
    currIntervalPos -= Math.floor(currIntervalPos)

    delay = (sliceInterval * (1 - currIntervalPos)) + 100

    if (remAmount > 0) {
      orders.push({
        label: `DELAY ${Math.floor(delay / 1000)}s`
      })
    }

    ts += delay
  }

  return orders
}
