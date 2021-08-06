import * as cartService from '../services/cart.service.js'
import express from 'express'

const cartRouter = express.Router()

cartRouter.route('/').get(cartService.findOne)

cartRouter.route('/add').post(cartService.addProduct)

cartRouter.route('/delete').post(cartService.deleteProduct)

cartRouter.route('/submit').post(cartService.cartSubmit)

export default cartRouter