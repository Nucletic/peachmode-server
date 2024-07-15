const Order = require('../models/orderModel');

exports.addOrder = async (req, res, next) => {
  try {
    const { usInfo, paymentMethod } = req.body
    console.log(usInfo, paymentMethod)
    const newOrder = Order({
      firstname: usInfo.firstname,
      lastname: usInfo.lastname,
      companyAddress: usInfo.company,
      address: usInfo.address.address1,
      email: usInfo.email,
      phone: usInfo.phone,
      city: usInfo.city,
      zipcode: usInfo.zipcode,
      state: usInfo.state,
      wantEmailAndUpdates: usInfo.wantEmailAndUpdates,
      paymentMethod: paymentMethod,
      products: usInfo.products,
      totalPrice: usInfo.TotalPrice
    });
    await newOrder.save();
    res.json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

exports.getOrder = async (req, res, next) => {
  try {
    const allOrders = await Order.find({});
    // loop through all orders and find the address by _id
    res.json({
      allOrders: allOrders
    })
  } catch (error) {
    next(error);
  }
}


exports.setDelivered = async (req, res, next) => {
  try {
    const selectedOrders = req.body;
    if (!Array.isArray(selectedOrders) || selectedOrders.length === 0) {
      throw new Error('Invalid selectedOrders array');
    }

    const setdeli = await Order.updateMany({ _id: { $in: selectedOrders } }, {
      $set: { delivered: true }
    }, { new: true });

    if (!setdeli || setdeli.nModified === 0) {
      throw new Error('No orders were updated');
    }

    res.json({
      data: setdeli
    });
  } catch (error) {
    res.json({
      error: error.message
    });
    next(error);
  }
}


exports.getUserOrders = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email)
    const orders = await Order.find({ email: email });
    res.status(200).json({ orders: orders });
  } catch (error) {
    res.status(500).json({ error: 'there is an error getting the orders.' });
  }
}