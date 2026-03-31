const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
  const accessToken = req.headers['authorization']?.split(' ')[1];
  
  console.log("accesstocken",accessToken);
  
  if (!accessToken) return res.status(401).json({ message: 'No access token' });

  try {
    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
    req.user = user;  // attach user info
    next();
  } catch (err) {
    // Access token expired → client should call main software with refresh token
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;