const express = require('express');
const coupon = require('../controllers/couponController.js')
const authController = require('../controllers/authController.js')
//const brandValidator = require('../utils/validators/brandValidator.js')
const router = express.Router();

router.use(authController.protect,authController.allowedTo("admin"))
router.route('/')
    .get(coupon.getAllCoupon)
    .post(coupon.createCoupon)
    .delete(coupon.deleteAllCoupon)

router.route('/:id')
    .get(coupon.getCoupon)
    .patch(coupon.updateCoupon)
    .delete(coupon.deleteCoupon)


module.exports = router