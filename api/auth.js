const jwt = require('express-jwt')
require('dotenv').config()

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
  req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  return req.headers.authorization.split(' ')[1];
  }

  return null;
}

const auth = {
  required: jwt({
    secret: process.env.SECRET_KEY,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
    algorithms: ['HS256']
  })
}

module.exports = auth