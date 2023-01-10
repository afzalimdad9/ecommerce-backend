const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/payment/process").post(isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
  const data = await processPayment(req.body);

  res
    .status(200)
    .json({
      success: data.success,
      client_secret: data.client_secret,
    });
}));

router.route("/stripeapikey").get(isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
  const data = sendStripeApiKey();
  res.status(200).json({ stripeApiKey: data.key });
}));

module.exports = router;
