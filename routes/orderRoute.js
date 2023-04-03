const express = require('express');

const router = express.Router();
const orderController = require('../controllers/order/orderController');
const buyerauthController = require('../controllers/buyer/buyerauthController');
const sellerauthController = require('../controllers/seller/sellerauthController');
const payment = require('../controllers/payment');
// const adminauthController = require('../controllers/admin/adminauthController');

router.post(
  '/create',
  buyerauthController.protect,
  payment.payment,
  orderController.createOrder
);
router.get('/all', orderController.getAllOrders);
router.patch(
  '/update/:Id',
  sellerauthController.protect,
  sellerauthController.restrictTo('seller'),
  orderController.updateOrderStatus
);
router.delete('/delete/:Id', orderController.deleteOrders);

module.exports = router;
