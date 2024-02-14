const express = require('express');
const address = require('../controllers/addressController.js')
const authController = require('../controllers/authController.js')
const { createAddressValidator,deleteAddressValidator } =require("../utils/validators/addressValidator.js")
const router = express.Router();

router.use(authController.protect,authController.allowedTo("user"))

router.get('/',address.getLoggedUserAddresse)
router.post("/",createAddressValidator,address.addAddress)
router.delete('/:addressId',deleteAddressValidator,address.removeAddress)
    
module.exports = router

