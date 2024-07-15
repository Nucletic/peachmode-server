const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const contentController = require('../controllers/contentController');
const giftCardController = require('../controllers/giftCardController');
const paymentController = require('../controllers/paymentController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logOut', userController.authenticate, userController.Logout, (req, res) => {
  res.send(res.status(200))
});
router.post('/updateAddress', userController.authenticate, userController.updateAddress, (req, res) => {
  res.send(res.status(200))
});
router.post('/addAddress', userController.authenticate, userController.addNewAddress, (req, res) => {
  res.send(res.status(200))
});
router.post('/deleteAddress', userController.authenticate, userController.deleteAddress, (req, res) => {
  res.send(res.status(200))
});
router.post('/addOrder', orderController.addOrder, (req, res) => {
  res.send(res.status(200))
});
router.get('/getOrders', userController.authenticate, userController.grantAccess('readAny', 'profile'), orderController.getOrder, (req, res) => {
  res.send(res.status(200))
});

router.get('/products', productController.fetchProduct, (req, res) => {
  res.send(res.status(200))
});
router.delete('/deleteProduct', userController.authenticate, userController.grantAccess('deleteAny', 'profile'), productController.deleteProduct, (req, res) => {
  res.send(res.status(200))
});
router.post('/addProduct', userController.authenticate, userController.grantAccess('updateAny', 'profile'), productController.addProduct, (req, res) => {
  res.send(res.status(200))
});
router.put('/editProduct', userController.authenticate, userController.grantAccess('updateAny', 'profile'), productController.editProduct, (req, res) => {
  res.send(res.status(200))
});
router.put('/setDelivered', userController.authenticate, userController.grantAccess('updateAny', 'profile'), orderController.setDelivered, (req, res) => {
  res.send(res.status(200))
});

router.put('/setSoldOut', userController.authenticate, userController.grantAccess('updateAny', 'profile'), productController.setSoldOut, (req, res) => {
  res.send(res.status(200))
});
router.get('/getContent', contentController.getContent, (req, res) => {
  res.send(res.status(200))
});
router.put('/saveContent', userController.authenticate, userController.grantAccess('updateAny', 'profile'), contentController.saveContent, (req, res) => {
  res.send(res.status(200))
});
router.put('/forgotPassword', userController.forgotPassword, (req, res) => {
  res.send(res.status(200))
});
router.put('/verifyOTP', userController.verifyOTP, (req, res) => {
  res.send(res.status(200))
});
router.put('/changePassword', userController.changePassword, (req, res) => {
  res.send(res.status(200))
});

router.get('/account', userController.authenticate, (req, res) => {
  res.send(req.rootUser);
})
router.get('/getGiftCards', userController.authenticate, userController.grantAccess('updateAny', 'profile'), giftCardController.getGiftCards, (req, res) => {
  res.send(req.rootUser);
})
router.put('/newGiftCards', userController.authenticate, userController.grantAccess('updateAny', 'profile'), giftCardController.addGiftCard, (req, res) => {
  res.send(req.rootUser);
})
router.post('/verifyGiftCards', giftCardController.verifyGiftCards, (req, res) => {
  res.send(req.rootUser);
})

router.post('/verifyAdmin', userController.verifyAdmin, (req, res) => {
  res.send(res.status(200))
})
router.post('/checkOut', paymentController.checkOut, (req, res) => {
  res.send(res.status(200))
})
router.post('/paymentVerification', paymentController.paymentVerification, (req, res) => {
  res.send(res.status(200))
})
router.get('/getKey', paymentController.getKey, (req, res) => {
  res.send(res.status(200))
})

router.post('/userOrders', userController.authenticate, orderController.getUserOrders, (req, res) => {
  res.send(res.status(200))
})

module.exports = router;