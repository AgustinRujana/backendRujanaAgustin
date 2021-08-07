import { cart as Cart } from '../model/cart.model.js'
import { product as Product } from '../model/products.model.js'
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

    const producto = await Product.findOne({ _id: productId })

    if(!producto) { return res.status(400).json({ message: 'Producto no encontrado'})}
    if(quantity > producto.stock) { return res.status(400).json({message: 'Cantidad no valida'})}

    let cart = await Cart.findOne({ userId: req.user._id });
    
    //Si el carrito no existe lo creo y agrego el producto
    if(!cart) {
        const newCart =  new Cart()
        newCart.userId = req.user._id
        newCart.products = [{ productId, quantity}]
        newCart.details = {
            street: 'Calle usuario',
            streetNumber: '999',
            postalCode: 'Postal',
            floor: 'Piso',
            apartment: 'Departamento'
        }

        await newCart.save()
        return res.status(201).json(newCart)

    } else { //Si el carrito existe
        let itemIndex = cart.products.findIndex(p => p.productId === productId);
        if (itemIndex > -1) {
            //Si existe el producto actualizo la cantidad
            let productItem = cart.products[itemIndex]; // productoItem es { productId: id , quantity: number }
            productItem.quantity = quantity;
            cart.products[itemIndex] = productItem;

            cart.markModified('products') //Sin esta propiedad no se actualizaba el objeto anidado #DATAZO

            await cart.save();
            return res.status(201).json(cart);
        } else {
            //Sino existe lo agrego
            cart.products.push({ productId, quantity});

            await cart.save();
            return res.status(201).json(cart);
        }
    }
}

export const cartSubmit = async (req, res) => {
    

    const cart = await Cart.findOne({ userId: req.user._id });
    
    if(!cart) {
        return res.status(400).json({ message: 'Carrito Inexistento o vacio'})

    }

    const totalCal = () => {
        var total = 0

        cart.products.forEach((product) => {
            Product.findOne({ _id: product.productId })
            .then( e => {
                console.log(total + ' + '  + e.price + '*' + product.quantity)
                total = total + e.price * product.quantity
                console.log('Total dentro then es ' + total)
            })
            console.log('Total dentro forEach es ' + total)
        })
        console.log('Total dentro funcion es ' + total)

        return total
    }

    let newOrder = new Order()
    newOrder.userId = req.user._id
    newOrder.items = cart.products
    newOrder.total = totalCal()

    //sendEmail('La tienda', 'Informacion de la orden', newOrder, 'receptor')


    //await newOrder.save()
    //await Cart.findByIdAndRemove(req.user._id);

    return res.status(201).json(newOrder);
}

export const deleteProduct = async (req, res) => {
    const { productId, quantity} = req.body;

    const producto = await Product.findOne({ _id: productId })
    let cart = await Cart.findOne({ userId: req.user._id });

    if(!producto) { return res.status(400).json({ message: 'Producto no encontrado'}) }
    if(!cart) { return res.status(400).json({ message: 'Carrito no encontrado'}) }

    let itemIndex = cart.products.findIndex(p => p.productId === productId);
    if (itemIndex > -1) {
        //Si existe el producto actualizo la cantidad
        let productItem = cart.products[itemIndex]; // productoItem es { productId: id , quantity: number }
        
        //Si quiero borrar mas de lo que tengo sale error
        if(quantity > productItem.quantity) { return res.status(400).json({message: 'Cantidad no valida'})}
        
        //Si borro la misma cantidad borro el producto
        if(quantity === productItem.quantity) {
            cart.products.splice(itemIndex, 1)

            cart.markModified('products') //Sin esta propiedad no se actualizaba el objeto anidado #DATAZO

            await cart.save();
            return res.status(201).json(cart);
        }
        //Sino lo resto a lo que tengo
        productItem.quantity = productItem.quantity - quantity;
        cart.products[itemIndex] = productItem;

        cart.markModified('products') //Sin esta propiedad no se actualizaba el objeto anidado #DATAZO

        await cart.save();
        return res.status(201).json(cart);
    } else {
        //Sino existe lo agrego
        cart.products.push({ productId, quantity});

        await cart.save();
        return res.status(201).json(cart);
    }
}