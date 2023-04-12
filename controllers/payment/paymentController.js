// const catchAsync = require('../Utils/catchAsync');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment method using a credit card
exports.payment = async (req, res, next) => {
  let paymentIntent;
  const amount = req.body.amount * 100; // in cents

  try {
    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: req.body.cardnumber,
        exp_month: req.body.expmonth,
        exp_year: req.body.expyear,
        cvc: req.body.cvc,
      },
    });

    // Create payment intent
    paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount,
      currency: 'pkr',
      confirmation_method: 'manual',
      confirm: true,
    });

    // Payment succeeded
    console.log('Payment succeeded:', paymentIntent);
    req.paid = true;
    req.body.payementId = paymentIntent.id;
    next();
  } catch (error) {
    // Payment failed
    console.log('Payment failed:', error);
    return res.status(500).send({ error: 'Payment failed' });
  }
};

// exports.refund = catchAsync(async (req, res, next) => {
//   // Refund payment if requested
//   const amount = req.amount * 100;
//   const id = req.payementId;
//   // console.log("Payment Id:", id);
//   // const order = req.order;
//   const servicebooked = req.servicebooked;

//   try {
//     const refund = await stripe.refunds.create({
//       payment_intent: id,
//       amount,
//     });
//     console.log('Refund succeeded:', refund);
//     // await order.save({ validateBeforeSave: false });
//     await servicebooked.save({ validateBeforeSave: false });
//     return res.status(200).send({ message: 'Refund succeeded' });
//   } catch (error) {
//     // console.log("Refund failed:", error);
//     return res.status(500).send({ error: 'Refund failed' });
//   }
// });
