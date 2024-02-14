const express = require('express');
const user = require('../controllers/userController.js')
const authController = require('../controllers/authController.js')
const userValidator = require('../utils/validators/userValidator.js')
const router = express.Router();

router.use(authController.protect)

router.get('/getMe',user.getMe,user.getUser)
router.patch('/changeMyPassword',userValidator.changeUserPasswordValidator,user.changeMyPassword)
router.patch('/updateMyData',userValidator.updateUserValidator,user.updateMyData)
router.patch('/deleteAccount',user.deleteMe)


//router.use(authController.allowedTo("admin"))
router.patch("/updatepassword/:id",userValidator.changeUserPasswordValidator,user.changeUserPassword)

router.route('/')
    .get(user.getAllUser)
    .post(user.uploadUserImage,user.resizeImage,userValidator.createUserValidator,user.createUser)
    .delete(user.deleteAllUser)

router.route('/:id')
    //rules
    .get(userValidator.getUserValidator,user.getUser)
    .patch(user.uploadUserImage,user.resizeImage,userValidator.updateUserValidator,user.updateUser)
    .delete(userValidator.deleteUserValidator,user.deleteUser)


module.exports = router