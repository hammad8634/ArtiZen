const express = require('express');

const router = express.Router();
const orderController = require('../controllers/order/orderController');

router.post('/', orderController.createOrder);
router.get('/all', orderController.getAllOrders);
router.patch('/update/:orderId', orderController.updateOrderStatus);
router.delete('/delete/:orderId', orderController.deleteOrders);

module.exports = router;
