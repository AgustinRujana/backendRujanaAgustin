import mongoose from "mongoose";

const collectionProducts = 'product';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
        type: Array,
        required: true
    }

})

export const product = mongoose.model(collectionProducts, productSchema, 'product')
