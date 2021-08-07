import mongoose from "mongoose";

const collectionOrders = 'order';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    items: {
        type: Array,
        required: true
    },
    state: {
        type: String,
        enum: ['generado', 'pagado', 'enviando', 'finalizado'],
        default: 'generado',
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
)

export const order = mongoose.model(collectionOrders, orderSchema, 'order')
