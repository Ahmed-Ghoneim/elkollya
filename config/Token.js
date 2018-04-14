const jwt = require('jsonwebtoken');
const keys = require('./keys');
// const fs = require('fs');
// var util = require('util');

function VerifyToken(req, res, next) {
//  fs.writeFileSync('logs.json', util.inspect(req) , 'utf-8');
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

  if(!token) return res.status(403).json({auth: false, msg: 'No token provided'});

  jwt.verify(token, keys.secret, function(err, decoded) {
    if (err)  return res.status(500).json({auth: false, msg: 'failed to authenticate token'});

    // if everything good, get user id and save it to request for use in other routes.
    req.userId = decoded.id;
    next();
  });
};

function SignToken(payload) {
  return jwt.sign(payload, keys.secret, {expiresIn: 604800});
};

module.exports.verify = VerifyToken;
module.exports.sign = SignToken;
