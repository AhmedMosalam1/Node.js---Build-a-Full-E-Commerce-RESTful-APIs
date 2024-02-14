const express = require('express');
const review = require('../controllers/reviewController.js')
const authController = require('../controllers/authController.js')
const reviewValidator = require('../utils/validators/reviewValidator.js')
const router = express.Router({mergeParams:true});



router.route('/')
    .get(review.createFilterObj,review.getAllReview)// ==> nested routes
    .post(authController.protect,authController.allowedTo("user"),review.setProductIdAndUserId,reviewValidator.createReviewValidator,review.createReview)
    .delete(authController.protect,authController.allowedTo("admin"),review.deleteAllReview)

router.route('/:id')
    //rules
    .get(reviewValidator.getReviewValidator,review.getReview)
    .patch(reviewValidator.updateReviewValidator,authController.protect,authController.allowedTo("user"),review.updateReview)
    .delete(reviewValidator.deleteReviewValidator,authController.protect,review.deleteReview)
    

module.exports = router