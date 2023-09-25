import {Schema, model} from "mongoose";

const orderSchema = Schema({
    name: String,
    size: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium"
    },

    price: Number,
    quantity: Number,
    date: {
        type: Date,
        default:Date.now

    }

})

const orderModel = model('order', orderSchema)

export default orderModel