/* eslint-disable no-console */
const AppError = require('../../utils/appError');
const Cart = require('../../models/cartModel');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');
const Product = require('../../models/productsModel');

exports.createcart = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  // console.log(`req.user is ${req.body.user}`);

  const product = await Product.findById(req.params.id);
  // console.log(`product is: ${product}`);
  if (!product) {
    return next(new AppError('Product not found'));
  }
  req.body.productName = product.productName;
  req.body.photos = product.photos;
  req.body.salePrice = product.salePrice;
  req.body.originalPrice = product.originalPrice;
  req.body.quantity = product.quantity;

  const cart = await Cart.findOne({ user: { $eq: req.user.id } });

  console.log(`Cart is: ${cart} and cart id: ${req.body.cart}`);
  if (!cart) {
    const cart1 = await Cart.create(req.body);

    res.status(201).json({
      status: 'Success',
      message: 'cart Created!',
      cart1,
    });
  } else {
    const {
      productId,
      productName,
      originalPrice,
      quantity,
      salePrice,
      photos,
    } = req.body;
    const item = {
      productId,
      productName,
      originalPrice,
      quantity,
      salePrice,
      photos,
    };
    const existingProduct = await Cart.findOne({
      $and: [{ _id: cart._id }, { 'products.productId': product._id }],
    }).select('');

    console.log(`ID cart is: ${cart._id} and productId: ${product._id}`);

    console.log(`\nExisting Product: ${existingProduct}`);
    if (existingProduct) {
      const updatedQuantity = cart.quantity * 1 - quantity * 1;
      console.log(`Update Quantity is---:${updatedQuantity}`);
      console.log(`Cart Quantity is---:${cart.quantity * 1}`);
      console.log(`Quantity is---:${quantity * 1}`);

      const increment = await Cart.findOneAndUpdate(
        { _id: cart._id, 'products.productId': productId },
        { $set: { 'products.$.quantity ': updatedQuantity } }
      );
      // console.log('body incrementing ---- :', increment);
    }
    const carts = await Cart.findOneAndUpdate(
      { id: cart._id },
      { $push: { products: item } },
      {}
    );
    if (carts) {
      res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        products: item,
      });
    } else {
      return next(new AppError("Can't add Item due to error"));
    }
  }
});

// exports.addItemToCart = catchAsync(async (req, res, next) => {

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const { index } = req.params;

  const carts = await Cart.findOneAndUpdate(
    {},
    { $pull: { items: { _id: index } } }
  );
  if (carts) {
    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully',
    });
  } else {
    return next(new AppError('Error While Removing Item'));
  }
});

exports.getTotalPrice = catchAsync(async (req, res, next) => {
  const carts = await Cart.findOne({});

  if (carts) {
    const totalPrice = carts.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    res.status(200).json({
      status: 'success',
      message: `Total Price is ${totalPrice.toFixed(2)}`,
    });
  } else {
    return next(new AppError('Error While Calculating Total Amount'));
  }
});

exports.getNumItemsInCart = catchAsync(async (req, res, next) => {
  const carts = Cart.findOne({});

  if (carts) {
    const numItems = carts.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    res.status(200).json({
      status: 'success',
      message: `Total Items are ${numItems}`,
    });
  } else {
    return next(new AppError('Error While Calculating Total Items.'));
  }
});

exports.getAllItemsInCart = catchAsync(async (req, res, next) => {
  const carts = Cart.findOne({});

  if (carts) {
    res.status(200).json({
      status: 'success',
    });
  } else {
    return next(new AppError('Error to get all Items.'));
  }
});

// exports.clearCart = catchAsync(async (req, res, next) => {
//   const carts = Cart.findOneAndUpdate({}, { $set: { items: [] } });

//   if (carts) {
//     res.status(200).json({
//       status: 'success',
//       message: 'Cart cleared',
//     });
//   } else {
//     return next(new AppError('Error in clearing cart.'));
//   }
// });

// exports.getallcarts = catchAsync(async (req, res, next) => {
//   const carts = await Cart.find();

//   res.status(200).json({
//     status: 'Success',
//     cart: carts || `No cart Found`,
//   });
// });

// exports.updatecarts = catchAsync(async (req, res, next) => {
//   const carts = await Cart.updateOne(
//     { _id: req.params.id },
//     { $set: req.body }
//   );
//   if (carts) {
//     res.status(200).json({
//       status: 'success',
//       message: 'cart updated successfully',
//     });
//   } else {
//     return next(
//       new AppError("Can't Update cart. As No cart found with such id")
//     );
//   }
// });

exports.deleteCart = catchAsync(async (req, res, next) => {
  const carts = await Cart.findByIdAndDelete(req.params.id);
  if (carts) {
    res.status(200).json({
      status: 'success',
      message: 'cart deleted successfully',
    });
  } else {
    return next(
      new AppError("Can't Delete cart. As No cart found with such id")
    );
  }
});

exports.getonecart = Factory.getOne(Cart);
