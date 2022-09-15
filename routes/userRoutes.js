const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const userRouter = express.Router();
const saltRounds = 10;
const JWT_SECRET = 'secret';

userRouter.post('/register', (req, res, next) => {
  const { userId, email, passcode } = req.body;

  if (userId && email && passcode) {
    bcrypt.genSalt(saltRounds, (saltingError, salt) => {
      if (saltingError) {
        return res.status(500).json({ success: false, error: saltingError });
      }
      bcrypt.hash(passcode, salt, (hashingError, hash) => {
        if (hashingError) {
          return res.status(500).json({ success: false, error: hashingError });
        }
        const newUser = new User({
          userId: userId,
          email: email,
          passcode: hash,
        });
        newUser
          .save()
          .then((result) => {
            const jwtToken = jwt.sign(
              { _id: result._id, userId: result.userId, email: result.email },
              JWT_SECRET,
              { algorithm: 'HS256' }
            );
            return res.status(200).json({ success: true, token: jwtToken });
          })
          .catch((error) => {
            return res.status(400).json({ success: false, error: error });
          });
      });
    });
  } else {
    return res.status(400).json({
      success: false,
      error: 'Please include userId, email, and passcode in request body.',
    });
  }
});

module.exports = userRouter;
