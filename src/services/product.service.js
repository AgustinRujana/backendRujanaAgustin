import { product as Product } from "../model/products.js"

export const getProducts = async (req, res) => {
    let products = await Product.find({})
    res.json(products)
}

export const getCategorie = async (req, res) => {
    let category = req.params.category
    let products = await Product.find({category: category})

    if(products.length === 0) { return res.json({}) }
    res.json(products)
}

export const addProduct = async (req, res) => {
    let data = req.body

    Product.findOne({ name: data.name }, function (err, product) {
        if (err) {
          return res.json(err)
        }
        if (product) {
          return res.json({message: 'Product name already in use'})
        }
        
        let newProduct = new Product()
        newProduct.name = data.name
        newProduct.description = data.description
        newProduct.category = data.category
        newProduct.price = data.price
        newProduct.stock = data.stock
        newProduct.pictures = []

        newProduct.save((err) => {
          if(err) { throw err }
          return res.status(201).json({message: 'Saving complete'});
        })
    })
}

export const updateOne = async (req, res) => {
  const producto = await Product.findOne({ _id: req.params.productId })

  if (!producto) {
      res.sendStatus(404)
  }

  const { name, description, category, price, stock } = req.body
  
  if(typeof name !== 'string') { return res.sendStatus(400) }
  if(typeof description !== 'string') { return res.sendStatus(400) }
  if(typeof category !== 'string') { return res.sendStatus(400) }
  if(typeof price !== 'number') { return res.sendStatus(400) }
  if(typeof stock !== 'number') { return res.sendStatus(400) }

  producto.name = name
  producto.description = description
  producto.category = category
  producto.stock = stock
  producto.price = price
}

export const deleteOne = async (req, res) => {
Product.findByIdAndDelete(req.params.productId).then(product => {
  if(!product) { return res.status(404)}
  res.status(200)
}).catch( err => {
  res.status(500).json({message: err})
})
}