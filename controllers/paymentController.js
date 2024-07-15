const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
require("dotenv").config();


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET
})

exports.checkOut = async (req, res, next) => {
  try {
    const { usInfo } = req.body;
    console.log(usInfo)
    const options = await {
      amount: Number(usInfo.TotalPrice) * 100,
      currency: "INR"
    }
    const order = await instance.orders.create(options);
    console.log(order);
    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log(razorpay_signature);
  console.log(expectedSignature);

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:3000/PaymentSuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

exports.getKey = async (req, res, next) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
}