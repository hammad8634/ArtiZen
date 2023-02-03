const express = require('express');
const productController = require('../controllers/products/productController');
const sellerauthController = require('../controllers/seller/sellerauthController');

const router = express.Router();

router.post(
  '/create',
  sellerauthController.protect,
  productController.createProduct
);

router.get('/all', productController.getallproducts);

module.exports = router;
