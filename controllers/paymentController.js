const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (body) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: body.amount,
    currency: "pkr",
    metadata: {
      company: "Ecommerce",
    },
  });

  return { success: true, client_secret: myPayment.client_secret };
};

exports.sendStripeApiKey = () => {
  return {
    key: process.env.STRIPE_API_KEY
  }
};
