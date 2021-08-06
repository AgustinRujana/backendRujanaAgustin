import { cart as Cart } from '../model/cart.model.js'
import { product, product as Product } from '../model/products.model.js'
import { order as Order } from '../model/orders.model.js'
import { sendEmail } from '../middleware/nodemailer.js'


export const findOne = (req, res) => {
    Cart.findOne({ userId:req.user._id }).then( cart => {
        if(!cart) { return res.status(404)}
        res.status(200).json(cart)
    }).catch( err => {
        res.status(500).json({message: err})
    })
}

export const addProduct = async (req, res) => {
    const { productId, quantity} = req.body;
    Product.findById({ productId }).then( product => {
        //Checkeo si el producto existe
        if(!product) { return res.status(400).json({message: 'No existe producto'})}
        //Checkeo el stock
        if(quantity > product.stock) { return res.status(400).json({message: 'Cantidad no valida'})}
        
        try {
            let cart = Cart.findOne({ userId: req.user.id });
        
            if (cart) {
                //Cuando el carrito existe
              let itemIndex = cart.products.findIndex(p => p.productId == productId);
        
              if (itemIndex > -1) {
                //Si existe el producto actualizo la cantidad
                let productItem = cart.products[itemIndex];
                productItem.quantity = quantity;
                cart.products[itemIndex] = productItem;
                cart.updateDate = new Date()
              } else {
                //Sino existe lo agrego
                cart.products.push({ productId, quantity});
                cart.updateDate = new Date()
              }
              //Guardo todo y envio
              cart = cart.save();
              return res.status(201).json(cart);
            } else {
                //Si el carrito no existe
              const newCart = Cart.create({
                userId,
                products: [{ productId, quantity}],
                creationDate: new Date(),
                updateDate: new Date(),
                details: {}
              });
        
              return res.status(201).json(newCart);
            }
        } catch (err) {
            res.status(500).json({message: err})
        }
    }).catch( err => {
        res.status(500).json({message: err})
    })
    
}
export const cartSubmit = (req, res) => {
    try {
        let cart = Cart.findOne({ userId: req.user.id });
    
        if (cart) {
            //Encuentro el carrito y chequeo que tenga algo
            if(cart.products.length === 0 ) {
                return res.status(400).json({message: 'Carrito Vacio'}); 
            }
            //Cuando el carrito existe y tiene algo
            const total = async () => {
                let total = 0
                cart.products.forEach(e => {
                    let product = Product.findById(e.productId)
                    total = total + product.price * e.quantity
                });
                return total
            }

            let newOrder = new Order()
            newOrder.userId = req.user._id
            newOrder.items = cart.products
            newOrder.creationDate = new Date()
            newOrder.state = 'Generado'
            newOrder.total = total()

            sendEmail('La tienda', 'Informacion de la orden', newOrder, 'receptor')
            //ACA MANDO EL MAIL
            newOrder =  newOrder.save()  

            cart.products = []
            cart = cart.save();

            return res.status(200);
        } else {
            //Si el carrito no existe    
            return res.status(400).json({message: 'No existe carrito'});
        }
    } catch (err) {
        res.status(500).json({message: err})
    }
    
}

export const deleteProduct = (req, res) => {
    const { productId, quantity} = req.body;
    Product.findById({ productId }).then( product => {
        //Checkeo si el producto existe
        if(!product) { return res.status(400)}
        //Checkeo el stock
        if(quantity < 0 || quantity > product.stock) { return res.status(400)}

        try {
            let cart =  Cart.findOne({ userId: req.user.id });
        
            if (cart) {
                //Cuando el carrito existe
              let itemIndex = cart.products.findIndex(p => p.productId == productId);
        
              if (itemIndex > -1) {
                //Si existe el producto actualizo la cantidad
                let productItem = cart.products[itemIndex];
                productItem.quantity = productItem.quantity - quantity;
                cart.products[itemIndex] = productItem;
                cart.updateDate = new Date()
              } else {
                //Sino ese producto en el carrito
                res.status(400)
              }
              //Guardo todo y envio
              cart =  cart.save();
              return res.status(201).send(cart);
            } else {
                //Si el carrito no existe        
              return res.status(400);
            }
        } catch (err) {
            res.status(500).json({message: err})
        }
    }).catch( err => {
        res.status(500).json({message: err})
    })
    
}