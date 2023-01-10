const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
 try {
  const data = await newOrder(req.body, req.user._id);
  
  res.status(201).json({
    success: true,
    order: data,
  });
 } catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
 } 
}));

router.route("/order/:id").get(isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
 try {
  const order = await getSingleOrder(req.params.id, next);

  res.status(200).json({
    success: true,
    order,
  })
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
 } 
}));

router.route("/orders/me").get(isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
  try{
  const orders = await myOrders(req.user._id);

  res.status(200).json({
    success: true,
    orders,
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
 } 
}));

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const data = await getAllOrders();

    res.status(200).json({
      success: data.success,
      totalAmount: data.totalAmount,
      orders: data.orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } 
}));

router
  .route("/admin/order/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const order = await updateOrder(req.params.id, req.body, next);
        res.status(200).json({
          success: order.success,
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    })
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const order = await deleteOrder(req.params.id, next);
        res.status(200).json({
          success: order.success,
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    })
  );

module.exports = router;
