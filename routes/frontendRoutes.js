const express = require('express');

const frontEndRouter = express.Router();

frontEndRouter.get('/register', (req, res, next) => {
  res.sendFile('register.html', { root: './public' });
});

module.exports = frontEndRouter;
