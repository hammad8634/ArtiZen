const express = require('express');
const cartController = require('../controllers/cart/cartController');
const buyerauthController = require('../controllers/buyer/buyerauthController');

const router = express.Router();

// router.post('/create', cartController.addItemToCart);
router.post(
  '/create/:id',
  buyerauthController.protect,
  cartController.createcart
);
router.delete('/:index', cartController.removeItemFromCart);
router.get('/totalPrice', cartController.getTotalPrice);
router.get('/numItems', cartController.getNumItemsInCart);
router.get('/allItems', cartController.getAllItemsInCart);
// router.get('/allcarts', cartController.getallcarts);
// router.patch('/update', cartController.updatecarts);

router.delete('/delete', cartController.deleteCart);

module.exports = router;
