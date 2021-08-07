import { cart as Cart } from '../model/cart.model.js'
import { product, product as Product } from '../model/products.model.js'
import { order as Order } from '../model/orders.model.js'
import { user as User } from '../model/user.model.js'



export const getOrder = async (req, res) => {
    try {
        const orders = await Order.find({userId: req.user._id})
        res.status(200).json(orders)
    } catch (err) {
        throw err        
    }
}

export const getOneOrder = async (req, res) => {
    try {
        const order = await Order.findOne({userId: req.user._id, _id: req.params.orderId})

        if(!order) { return res.status(404).json({message: 'Orden no encontrada'}) }
        res.status(200).json(order)
    } catch (err) {
        throw err        
    }
}

export const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.body
        const order = await Order.findOne({_id: orderId})

        if(!order) { return res.status(404).json({message: 'La orden no existe'}) }
        if(order.state !== 'generado') { return res.status(400).json({message: 'El estado de la orden es distinto de generado'})}

        order.state = 'finalizado'
        await order.save()
        //sendEmail('La tienda', 'Orden Completa', order, 'receptor')
        return res.status(200).json(order)
    } catch (err) {
        throw err        
    }
}