/* eslint-disable no-console */
const AppError = require('../../utils/appError');
const Cart = require('../../models/cartModel');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');
const Product = require('../../models/productsModel');

exports.createcart = catchAsync(async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found'));
    }

    if (product.quantity === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Product is out of stock',
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      const newCart = await Cart.create({
        user: userId,
        products: [productId],
        quantity: 1,
      });

      res.status(201).json({
        status: 'Success',
        message: 'Cart created!',
        cart: newCart,
      });
    } else {
      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }

      await cart.save();

      res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        cart,
      });
    }
  } catch (error) {
    console.error(error);
    return next(new AppError('Error for cart create API.', error));
  }
});

exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found'));
    }
    console.log('found product');
    const cart = await Cart.findOne({}).lean();
    console.log('found cart', cart);
    if (!cart) {
      return next(new AppError('No cart found', 404));
    }
    console.log('found cart 22');

    const cartItemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return next(new AppError('Cart item not found', 404));
    }

    cart.products[cartItemIndex].quantity = quantity;

    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      { products: cart.products },
      { new: true }
    ).lean();
    res.status(200).json({
      status: 'success',
      message: 'Cart item quantity updated successfully',
      cartItem: updatedCart.products[cartItemIndex],
    });
  } catch (error) {
    console.error(error);
    return next(new AppError('Error updating cart item quantity', error));
  }
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  try {
    const productId = req.params.id; // Assuming the API parameter is named `id`

    const cart = await Cart.findOne({}).lean();

    if (!cart) {
      console.log('No cart found');
      return next(new AppError('No cart found', 404));
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );

    console.log('Cart:', cart);
    console.log('Product Index:', productIndex);

    if (productIndex === -1) {
      console.log('Product not found in cart');
      return next(new AppError('Product not found in cart', 404));
    }

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity--;
    } else {
      cart.products.splice(productIndex, 1);
    }

    console.log('Updated Cart:', cart);

    const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
      new: true,
    }).lean();

    console.log('Updated Cart:', updatedCart);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully',
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError('Error while removing item from cart', error));
  }
});

exports.addItemToCart = catchAsync(async (req, res, next) => {
  try {
    const productId = req.params.id; // Assuming the API parameter is named `id`

    const cart = await Cart.findOne({}).lean();

    if (!cart) {
      console.log('No cart found');
      return next(new AppError('No cart found', 404));
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );

    console.log('Cart:', cart);
    console.log('Product Index:', productIndex);

    if (productIndex === -1) {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    } else {
      cart.products[productIndex].quantity++;
    }

    console.log('Updated Cart:', cart);

    const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
      new: true,
    }).lean();

    console.log('Updated Cart:', updatedCart);

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart successfully',
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError('Error while adding item to cart', error));
  }
});

exports.getAllItemsInCart = catchAsync(async (req, res, next) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'products',
        populate: {
          path: 'product owner store', // Populate nested fields 'product', 'owner', and 'store'
          select: '-__v -createdAt -updatedAt', // Exclude unnecessary fields
        },
        select: '-__v -createdAt -updatedAt', // Exclude unnecessary fields from 'products'
      })
      .lean();

    if (!cart) {
      return next(new AppError('No cart found for the user.', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'All Cart Products',
      cart: cart.products,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError('Error while retrieving cart.', error));
  }
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  try {
    const productId = req.params.id;

    const cart = await Cart.findOne({}).lean();

    if (!cart) {
      console.log('No cart found');
      return next(new AppError('No cart found', 404));
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );

    console.log('Cart:', cart);
    console.log('Product Index:', productIndex);

    if (productIndex === -1) {
      console.log('Product not found in cart');
      return next(new AppError('Product not found in cart', 404));
    }

    cart.products.splice(productIndex, 1);

    console.log('Updated Cart:', cart);

    const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
      new: true,
    }).lean();

    console.log('Updated Cart:', updatedCart);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully',
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError('Error while removing item from cart', error));
  }
});

exports.getonecart = Factory.getOne(Cart);
