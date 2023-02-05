const express = require('express');
// const sellerController = require('../controllers/seller/sellerController');
const sellerauthController = require('../controllers/seller/sellerauthController');
const storeController = require('../controllers/store/stroreController');

const router = express.Router();

router.post(
  '/create',
  sellerauthController.protect,
  storeController.createStore
);

router.get('/all', storeController.getallstores);
router.get('/one/:id', storeController.getonestore);

router
  .route('/deletestoreanditsproducts/:id')
  .delete(
    sellerauthController.protect,
    storeController.deleteStoreanditsProducts
  );

module.exports = router;
