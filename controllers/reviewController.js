const Review = require("../models/reviewModel")
const handle = require('./handelrFactory')

exports.setProductIdAndUserId = (req,res,next) =>{
    if (!req.body.product){
        req.body.product = req.params.productId
    }
    if (!req.body.user){
        req.body.user = req.user._Id
    }
    next()
}

exports.createFilterObj = (req, res, next) => {
    let filterObj = {};
    if (req.params.productId) filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
    next();
  };
// @access  public
exports.getAllReview = handle.getAll(Review)

// @access  private
exports.createReview = handle.createOne(Review)

exports.getReview = handle.getOne(Review)

exports.deleteReview = handle.deleteOne(Review)

exports.deleteAllReview = handle.deleteAll(Review)

exports.updateReview = handle.updateOne(Review)