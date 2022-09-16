const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const userRouter = express.Router();
const saltRounds = 10;
const JWT_SECRET = 'secret';

userRouter
  .post('/register', (req, res, next) => {
    const { userId, email, passcode } = req.body;

    if (userId && email && passcode) {
      bcrypt.genSalt(saltRounds, (saltingError, salt) => {
        if (saltingError) {
          return res.status(500).json({ success: false, error: saltingError });
        }
        bcrypt.hash(passcode, salt, (hashingError, hash) => {
          if (hashingError) {
            return res
              .status(500)
              .json({ success: false, error: hashingError });
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
              return res
                .status(400)
                .json({ success: false, error: error.message });
            });
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please include userId, email, and passcode in request body.',
      });
    }
  })
  .post('/login', async (req, res, next) => {
    const { userId, passcode } = req.body;

    if (userId && passcode) {
      const user = await User.findOne({ userId: userId });
      if (user) {
        bcrypt.compare(passcode, user.passcode, (bcryptError, same) => {
          if (same) {
            const jwtToken = jwt.sign(
              { _id: user._id, userId: user.userId, email: user.email },
              JWT_SECRET,
              { algorithm: 'HS256' }
            );
            return res.status(200).json({ success: true, token: jwtToken });
          } else {
            return res
              .status(400)
              .json({ success: false, error: 'Incorrect password' });
          }
        });
      } else {
        return res.status(400).json({ success: false, error: 'No user found' });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please include userId and passcode in request body.',
      });
    }
  });

module.exports = userRouter;
