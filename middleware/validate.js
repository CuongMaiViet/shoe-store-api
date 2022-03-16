
const checkProductData = async (req, res, next) => {
    const { title, price, description, category, image } = req.body
    const errors = []

    for (const key in req.body) {
        if (!req.body[key]) {
            errors.push(`Please add product's ${key}.`)
        }
    }

    if (errors.length > 0) {
        return res.status(401).json({ msg: errors })
    }

    next()
}

module.exports = checkProductData