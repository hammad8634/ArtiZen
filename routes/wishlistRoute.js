const express = require('express');

const router = express.Router();
const wishlistController = require('../controllers/wishlist/wishlistController');

router.post('/', wishlistController.addToWishlist);
router.get('/one/:id', wishlistController.getWishlistItems);
router.delete('/removeproduct/:id', wishlistController.removeFromWishlist);

module.exports = router;
