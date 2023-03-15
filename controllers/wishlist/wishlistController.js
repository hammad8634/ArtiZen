const Wishlist = require('../../models/wishlistModel');
// const AppError = require('../../utils/appError');

exports.addToWishlist = async (req, res, next) => {
  try {
    // get user ID from authenticated user
    // const userId = req.user._id;

    // get product ID from request body
    const { userId, productId } = req.body;

    // create new wishlist item
    const wishlistItem = new Wishlist({
      user: userId,
      product: productId,
    });

    // save wishlist item to database
    await wishlistItem.save();

    res.status(201).json({ message: 'Product added to wishlist' });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: `Server error: ${err}` });
  }
};
