const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const restricted = async (req, res, next) => {

  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  // let token = req.headers.authorization;
  const authHeader = String(req.headers['authorization'] || '');
  let token;

  if (!authHeader || authHeader == null) {
    return next({ status: 401, message: 'token required'})
  }

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7, authHeader.length);
  } else {
    token = authHeader;
  }

  try {
    req.decodedJWT = await jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next({status: 401, message: 'token invalid'});
  }

  next()


  // jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
  //   if (err) {
  //     next({ status: 401, message: 'token invalid'});
  //   } else {
  //     // req.decodedJwt = decodedToken;
  //     // console.log(req.decodedToken);
  //     next()
  //   }
  // })

};

module.exports = {restricted};