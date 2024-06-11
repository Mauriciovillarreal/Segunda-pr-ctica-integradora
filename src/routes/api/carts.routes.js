// const fs = require(`node:fs`)
const { Router } = require('express')
const CartsManagerMongo = require('../../dao/cartManagerMongo.js')

const router = Router()
const cartService = new CartsManagerMongo()

router.get('/', async (req, res) => {
  const carts = await cartService.getCarts()
  res.send(carts)
})

router.post('/', async (req, res) => {
  const cart = await cartService.createCart()
  res.send(cart)
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cart = await cartService.addProductToCart(cid, pid)
    res.json(cart)
  } catch (error) {
    console.error('An error occurred while adding the product to the cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const result = await cartService.deleteCart(cid, res)
    res.json({ message: "Cart deleted successfully", data: result })
  } catch (error) {
    console.error('An error occurred while restarting the cart.:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  try {
    const cart = await cartService.deleteProduct(cid, pid)
    res.json({ message: "Product delete successfully", data: cart })
  } catch (error) {
    console.error('An error occurred while deleting the product from the cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body
  try {
    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity)
    res.json({ message: "Quantity was changed successfully", data: updatedCart })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = router