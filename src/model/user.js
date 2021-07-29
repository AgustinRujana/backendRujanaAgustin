import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const collectionUsers = 'user';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    admin: {
        type: Boolean
    }
})

//////////////////////////////////
//            Methods           //
//////////////////////////////////

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

export const user = mongoose.model(collectionUsers, userSchema, 'user')

