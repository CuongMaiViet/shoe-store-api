const Products = require('../models/productModel')

const productCtrl = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Products.find()

            return res.status(200).json({
                size: products.length,
                data: products
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    getProductByID: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)

            if (!product) {
                return res.status(404).json({ msg: "This product does not exist" })
            }

            return res.status(200).json({
                data: product
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    addNewProduct: async (req, res) => {
        try {
            const newProduct = new Products(req.body)
            await newProduct.save()

            return res.status(200).json({
                data: newProduct
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    updateProductByID: async (req, res) => {
        try {
            const product = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true })

            if (!product) {
                return res.status(404).json({ msg: "This product does not exist" })
            }

            return res.status(200).json({
                data: product
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    deleteProductByID: async (req, res) => {
        try {
            const product = await Products.findByIdAndDelete(req.params.id)

            if (!product) {
                return res.status(404).json({ msg: "This product does not exist" })
            }

            return res.status(200).json({
                msg: "Delete product successfully"
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

module.exports = productCtrl