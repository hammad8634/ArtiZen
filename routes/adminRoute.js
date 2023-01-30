const express = require('express');
const adminController = require('../controllers/admin/adminController');
const adminauthController = require('../controllers/admin/adminauthController');

const router = express.Router();

// router.route('/users').get(userController.getAllUsers);

router.post('/create', adminauthController.signup);

router.route('/login').post(adminauthController.login);
router.route('/resetpassword/:token').patch(adminauthController.resetPassword);
router.route('/forgotpassword').post(adminauthController.forgotPassword);

// router.patch('/emailconfirm/:token', authController.emailConfirm);

// router.route('/login').post(authController.login);

// router.route('/forgotpassword').post(authController.forgotPassword);
// router.route('/resetpassword/:token').patch(authController.resetPassword);

// router.use(authController.protect);

router.patch(
  '/updatepassword',
  adminauthController.protect,
  adminauthController.updatePass
);

router
  .route('/profile')
  .get(adminauthController.protect, adminController.getProfile);

module.exports = router;