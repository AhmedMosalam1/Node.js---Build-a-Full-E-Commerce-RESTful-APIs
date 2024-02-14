const Coupon = require("../models/couponModel")
const handle = require('./handelrFactory')


// @access  public
exports.getAllCoupon = handle.getAll(Coupon)

// @access  private
exports.createCoupon = handle.createOne(Coupon)

exports.getCoupon = handle.getOne(Coupon)

exports.deleteCoupon = handle.deleteOne(Coupon)

exports.deleteAllCoupon = handle.deleteAll(Coupon)

exports.updateCoupon = handle.updateOne(Coupon)