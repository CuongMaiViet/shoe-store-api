const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')
const validate = require('../middleware/validate')

router.get('/products', productCtrl.getAllProducts)

router.get('/products/:id', productCtrl.getProductByID)

router.post('/products', validate, productCtrl.addNewProduct)

router.put('/products/:id', validate, productCtrl.updateProductByID)

router.delete('/products/:id', productCtrl.deleteProductByID)

module.exports = router;