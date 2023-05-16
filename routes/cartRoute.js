const express = require('express');
const cartController = require('../controllers/cart/cartController');
const buyerauthController = require('../controllers/buyer/buyerauthController');

const router = express.Router();

router.post('/create', buyerauthController.protect, cartController.createcart);
// router.delete('/removeCartItem/:id', cartController.removeItemFromCart);
router.get('/allItems/:id', cartController.getAllItemsInCart);
router.delete('/delete/:id', cartController.deleteCart);
router.patch(
  '/updateCartItemQuantity/:id',
  cartController.updateCartItemQuantity
);
// router.get('/allcarts', cartController.getallcarts);

module.exports = router;
