const express = require('express');
const buyerController = require('../controllers/buyer/buyerController');
const buyerauthController = require('../controllers/buyer/buyerauthController');
const adminauthController = require('../controllers/admin/adminauthController');

const router = express.Router();

router.route('/all').get(buyerController.getAllUsers);

router.post('/create', buyerauthController.signup);

router.route('/login').post(buyerauthController.login);
router.route('/resetpassword/:token').patch(buyerauthController.resetPassword);
router.route('/forgotpassword').post(buyerauthController.forgotPassword);
router.route('/delete/:id').delete(buyerController.deleteBuyer);

// router.patch('/emailconfirm/:token', authController.emailConfirm);

// router.route('/login').post(authController.login);

// router.route('/forgotpassword').post(authController.forgotPassword);
// router.route('/resetpassword/:token').patch(authController.resetPassword);

// router.use(authController.protect);

router.patch(
  '/updatepassword',
  buyerauthController.protect,
  buyerauthController.updatePass
);

router
  .route('/profile')
  .get(buyerauthController.protect, buyerController.getProfile);

// router.get('/profile', buyerController.getProfile);
module.exports = router;
