const express = require('express');
const auth = require('../controllers/authController.js')
const authValidator = require('../utils/validators/authValidator.js')
const router = express.Router();

router.post('/signup',authValidator.signupValidator,auth.signup)
router.post('/login',authValidator.loginValidator,auth.login)
router.post('/forgetPassword',auth.forgetPassword)
router.post('/VerifyResetCode',auth.verifyPassResetCode)
router.patch('/resetPassword',auth.resetPassword)



    //.get(user.getAllUser)
   // .delete(user.deleteAllUser)

// router.route('/:id')
//     //rules
//     .get(userValidator.getUserValidator,user.getUser)
//     .patch(user.uploadUserImage,user.resizeImage,userValidator.updateUserValidator,user.updateUser)
//     .delete(userValidator.deleteUserValidator,user.deleteUser)


module.exports = router