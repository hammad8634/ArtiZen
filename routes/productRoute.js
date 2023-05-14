const express = require('express');
const productController = require('../controllers/products/productController');
const sellerauthController = require('../controllers/seller/sellerauthController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the destination folder where the uploaded images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const filename = `${uniqueSuffix}.${extension}`;
    cb(null, filename); // Define the filename for the uploaded image
  },
});

const upload = multer({ storage });

router.post(
  '/create',
  sellerauthController.protect,
  upload.array('productImages', 6),
  productController.createProduct
);

router.get('/all', productController.getallproducts);
router.get(
  '/seller/all/',
  sellerauthController.protect,
  productController.getallsellerproducts
);
router.get('/one/:id', productController.getoneproduct);
router.patch('/update/:id', productController.updateProducts);
router.delete('/delete/:id', productController.deleteProducts);

module.exports = router;
