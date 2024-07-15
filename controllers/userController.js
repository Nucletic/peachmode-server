const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { roles } = require('../roles');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const { log } = require('console');

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, role: 'basic' });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user exist with this email, use another email' });
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const accesstoken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    res.cookie('refreshToken', accesstoken, {
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      secure: true
    });
    await User.findByIdAndUpdate(user._id, { accesstoken });
    res.status(200).json({
      data: true
    });
  } catch (error) {
    next(error);
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided.');
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    const rootUser = await User.findOne({ _id: verifyToken.userId, accesstoken: token });
    if (!rootUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    req.role = rootUser.role;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send('Unauthorized: Invalid token.');
  }
};

exports.Logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { userId, addressId, firstname, lastname, company,
      phone, address1, address2, city, zipcode, state, defaultAdd } = req.body;
    const result = await User.updateOne({ _id: userId, 'address.addressId': addressId }, {
      $set: {
        'address.$.firstname': firstname,
        'address.$.lastname': lastname,
        'address.$.company': company,
        'address.$.phone': phone,
        'address.$.address1': address1,
        'address.$.address2': address2,
        'address.$.city': city,
        'address.$.zipcode': zipcode,
        'address.$.state': state,
        'address.$.defaultAdd': defaultAdd
      }
    }
    );
    if (result.nModified === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({
      data: true
    });
  } catch (error) {
    next(error);
  }
};

exports.addNewAddress = async (req, res, next) => {
  try {
    const { userId, addressId, firstname, lastname, company, phone,
      address1, address2, city, zipcode, state, defaultAdd } = req.body;

    const result = await User.updateOne({ _id: userId }, {
      $push: {
        address: {
          addressId: addressId,
          firstname: firstname,
          lastname: lastname,
          company: company,
          phone: phone,
          address1: address1,
          address2: address2,
          city: city,
          zipcode: zipcode,
          state: state,
          defaultAdd: defaultAdd
        }
      }
    }
    );
    if (result.nModified === 0) {
      return res.status(500).json({ error: 'Failed to add new address' });
    }
    res.status(200).json({
      data: true
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { userId, addressId } = req.body;
    const result = await User.updateOne(
      { _id: userId, 'address.addressId': addressId }, {
      $pull: {
        address: {
          addressId: addressId
        }
      }
    });
    if (result.nModified === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({
      data: true
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find user by email and password
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'No user exist with this email, try again with different email.' });
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid Password or email please check and try again.' });
    const accesstoken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    const coki = res.cookie("refreshToken", accesstoken, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });
    await User.findByIdAndUpdate(user._id, { accesstoken })

    if (user.role !== 'admin') {
      return res.json({ success: true, isAdmin: false });
    }

    // User is an admin
    res.json({ success: true, isAdmin: true, role: user.role });
  } catch (error) {
    // Handle database or server error
    res.status(500).json({ message: 'Internal server error' });
  }
}

const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const OTP = generateOTP();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user document with OTP
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { userOTP: OTP.toString() } },
      { new: true }
    );

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'summer.haag@ethereal.email',
        pass: 'RJXUaAZqySaqd4WXrm'
      }
    });
    // Prepare mail options
    const mailOptions = {
      from: 'peachMode <arlo.denesik@ethereal.email>',
      to: email,
      subject: 'Email OTP Verification',
      text: `Your OTP is: ${OTP}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    if (info.messageId) {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      console.log(info);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, OTP } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if OTP matches
    if (user.userOTP !== OTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    // OTP is valid, remove it from the user document
    user.userOTP = '';
    await user.save();
    // Sending a success response
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword)
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, send a response indicating user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password with the new hashed password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    // Send a success response
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};