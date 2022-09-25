const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/users').get(userController.getAllUsers);
router.post('/createuser', userController.createUser);

router
  .route('/signup')
  .post(authController.signup, authController.sendEmailConfirm);

router.patch('/emailconfirm/:token', authController.emailConfirm);

router.route('/login').post(authController.login);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

router.use(authController.protect);

router.patch('/updatepassword', authController.updatePass);

router.route('/getme').get(userController.getMe, userController.getUser);

module.exports = router;
