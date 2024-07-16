const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const User = require('./models/userModel');
const routes = require('./routes/route');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const responseTime = require('./response-time');


require("dotenv").config();

mongoose.set('strictQuery', true);

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'https://peach-mode.netlify.app/'];


const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};


app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
// app.use(responseTime);

// mongoose.connect(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/peachmode')
mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://pansu:pansu@cluster0.rshy9x2.mongodb.net/peachmode?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the Database Successfully');
  });

app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token'];
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" })
    }
    res.locals.loggedInUser = await User.findById(userId);
    next();
  } else {
    next();
  }
});


app.use('/', routes); app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT);
});