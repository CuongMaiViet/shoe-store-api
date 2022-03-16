const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    model_id: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: {
        type: Object,
        default: {}
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Products", ProductSchema)