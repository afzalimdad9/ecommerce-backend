const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = async (body, id) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: id,
  });

  return order;
};

// get Single Order
exports.getSingleOrder = async (id, next) => {
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  return order;
};

// get logged in user  Orders
exports.myOrders = async (id) => {
  const orders = await Order.find({ user: id });

  return orders;

};

// get all Orders -- Admin
exports.getAllOrders = async () => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  return {totalAmount, orders, success: true};
};

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (id, body, next) => {
  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = body.status;

  if (body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  return {
    success: true,
  };
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = async (id, next) => {
  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  return { success: true };
};
