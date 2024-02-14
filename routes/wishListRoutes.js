const express = require('express');
const wishlist = require('../controllers/wishListController.js')
const authController = require('../controllers/authController.js')
const { createWishListValidator , deleteWishListValidator } =require("../utils/validators/wishListValidator.js")
const router = express.Router();

router.use(authController.protect,authController.allowedTo("user"))

router.get('/',wishlist.getLoggedUserWishlist)
router.post("/",createWishListValidator,wishlist.addProductToWishlist)
router.delete('/:productId',deleteWishListValidator,wishlist.removeProductFromWishlist)
    
module.exports = router