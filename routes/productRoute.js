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
router.patch('/update/:id', productController.updateProducts);
router.delete('/delete/:id', productController.deleteProducts);

router.get('one/:id', productController.getoneproduct);

module.exports = router;
