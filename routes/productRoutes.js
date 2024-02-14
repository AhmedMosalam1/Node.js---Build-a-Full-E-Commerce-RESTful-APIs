const express = require('express');
const product = require('../controllers/productController.js')
const reviewRoutes = require("../routes/reviewRoutes.js")
const authController = require('../controllers/authController.js')
const productValidator = require('../utils/validators/productValidator.js')
const router = express.Router();

// POST   /product/jkshjhsdjh2332n/review
// GET    /product/jkshjhsdjh2332n/review
// GET    /product/jkshjhsdjh2332n/review/87487sfww3
router.use("/:productId/review",reviewRoutes)

router.route('/')
    .get(product.getAllProduct)
    .post(authController.protect,authController.allowedTo("admin"),product.uploadProductImages,product.resizeProductImages,productValidator.createProductValidator,product.createProduct)
    .delete(authController.protect,authController.allowedTo("admin"),product.deleteAllProduct)
    

router.route('/:id')
    //rules
    .get(productValidator.getProductValidator, product.getProduct)
    .patch(authController.protect,authController.allowedTo("admin"),product.uploadProductImages,product.resizeProductImages,productValidator.updateProductValidator, product.updateProduct)
    .delete(authController.protect,authController.allowedTo("admin"),productValidator.deleteProductValidator, product.deleteProduct)


module.exports = router