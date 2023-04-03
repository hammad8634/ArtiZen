const Order = require('../../models/orderModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const Factory = require('../factoryHandler');
const OrderProduct = require('../../models/orderProductsModel');
// Create a new order
exports.createOrder = catchAsync(async (req, res, next) => {
  const { products, totalAmount } = req.body;
  const user = req.user.id;
  const order = new Order({ user, products, totalAmount });
  await order.save();

  const productss = products.map(async (singleSellerProduct) => {
    const prod = await OrderProduct.create({});
  });

  res.status(201).json({
    status: 'Success',
    message: 'Product Created!',
    order,
  });
});

// Get all orders
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('products.product', 'name price');
  res.status(200).json({
    status: 'Success',
    order: orders || `No Product Found`,
  });
});

// Update order status By Seller
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId, status } = req.body;

  const orders = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  if (orders) {
    res
      .status(200)
      .json({ status: 'success', message: 'Order updated successfully' });
  } else {
    return next(
      new AppError("Can't Update product. As No Order found with such id")
    );
  }
});

exports.deleteOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.findByIdAndDelete(req.params.id);
  if (orders) {
    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully',
    });
  } else {
    return next(
      new AppError("Can't Delete Order. As No Order found with such id")
    );
  }
});

exports.getoneorder = Factory.getOne(Order);
