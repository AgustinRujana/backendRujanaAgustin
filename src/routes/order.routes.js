import express from 'express'

import * as orderService from '../services/order.service.js'

const orderRouter = express.Router()

orderRouter.route('/').get(orderService.getOrder)
orderRouter.route('/:orderId').get(orderService.getOneOrder)
orderRouter.route('/complete').post(orderService.completeOrder)

export default orderRouter

