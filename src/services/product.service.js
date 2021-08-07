import { product, product as Product } from "../model/products.model.js"

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
  producto.name = name
  producto.description = description
  producto.category = category
  producto.stock = stock
  producto.price = price

  await producto.save()
  res.status(200).json({ message: 'Producto Actualizado'})
}

export const deleteOne = async (req, res) => {
  try {
    const id = req.params.productId;
    const producto = await Product.findByIdAndRemove(id);
    if(!producto) { return res.status(404).json({ message: 'Producto no encontrado'})}
    res.status(200).json({message: 'Producto Borrado', producto});
  } catch (err) {
    return res.status(500).json({message: err});
  }
}