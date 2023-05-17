const express = require('express');
const sellerController = require('../controllers/seller/sellerController');
const sellerauthController = require('../controllers/seller/sellerauthController');

const router = express.Router();

router.route('/all').get(sellerController.getAllUsers);

router.post('/create', sellerauthController.signup);

router.route('/login').post(sellerauthController.login);
router.route('/resetpassword/:token').patch(sellerauthController.resetPassword);
router.route('/forgotpassword').post(sellerauthController.forgotPassword);
router.patch('/update/:id', sellerauthController.updateStatus);

// router.patch('/emailconfirm/:token', authController.emailConfirm);

// router.route('/login').post(authController.login);

// router.route('/forgotpassword').post(authController.forgotPassword);
// router.route('/resetpassword/:token').patch(authController.resetPassword);

// router.use(authController.protect);

router.patch(
  '/updatepassword',
  sellerauthController.protect,
  sellerauthController.updatePass
);

router
  .route('/profile')
  .get(sellerauthController.protect, sellerController.getProfile);

module.exports = router;
