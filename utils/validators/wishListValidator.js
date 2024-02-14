const { check , param} = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')


exports.createWishListValidator = [
    check('productId').isMongoId().withMessage('Invalid Product Id'),
    validatorMiddleware

]


exports.deleteWishListValidator = [
    param('productId').isMongoId().withMessage('Invalid Product Id'),
    validatorMiddleware
]