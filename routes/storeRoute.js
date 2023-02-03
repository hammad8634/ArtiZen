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

module.exports = router;
