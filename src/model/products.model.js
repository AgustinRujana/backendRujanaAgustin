import mongoose from "mongoose";

const collectionProducts = 'product';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    pictures: {
        type: Array
    }

})

export const product = mongoose.model(collectionProducts, productSchema, 'product')
