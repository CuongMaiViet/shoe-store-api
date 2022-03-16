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

ProductSchema.index({ title: 'text', category: 'text' })


const Products = mongoose.model("Products", ProductSchema)

Products.createIndexes({ title: 'text', category: 'text' })

module.exports = Products