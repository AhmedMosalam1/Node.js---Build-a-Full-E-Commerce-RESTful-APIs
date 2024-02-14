const express = require('express');
const cart = require('../controllers/cartController.js')
const authController = require('../controllers/authController.js')
//const brandValidator = require('../utils/validators/brandValidator.js')
const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"))

router.route('/')
    .get(cart.getLoggedUserCart)
    .post(cart.addProductToCart)
    .delete(cart.clearCart)

router.route('/:itemId')
    //.get(coupon.getCoupon)
    .patch(cart.updateCartItem)
    .delete(cart.removeSpecificCartItem)

router.patch('/applycoupon', cart.applyCoupon)

module.exports = router