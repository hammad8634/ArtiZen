const Wishlist = require('../../models/wishlistModel');

exports.addToWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    // Find the wishlist document for the user
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // If wishlist doesn't exist, create a new one and add the product ID
      const newWishlist = new Wishlist({
        user: userId,
        products: [productId],
      });

      await newWishlist.save();
      return res.status(201).json({
        status: 'success',
        message: 'Product added to wishlist, successfully',
        productId: productId,
      });
    }

    // Check if the product already exists in the wishlist
    if (wishlist.products.includes(productId)) {
      return res
        .status(409)
        .json({ message: 'Product already added to wishlist' });
    }

    // If wishlist exists and the product is not already added, push the product ID into the existing array
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(201).json({ message: 'New Product added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error for creating wishlist' });
  }
};

exports.getWishlistItems = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find the wishlist document for the user
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      'products'
    );
    console.log(`wishlist of user ${userId} and items ${wishlist}`);

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'All wishlisted Products',
      wishlist: wishlist.products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    // Find the wishlist document for the user
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Check if the product exists in the wishlist
    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    // Remove the product from the wishlist
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Server error for removing product from wishlist' });
  }
};
