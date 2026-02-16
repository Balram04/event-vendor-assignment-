const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Try to get token from cookie first, then from Authorization header
  let token = req.cookies.token;
  
  if (!token) {
    console.log('Auth failed: No token found');
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth failed: Invalid token', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const roleCheck = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { auth, roleCheck };
