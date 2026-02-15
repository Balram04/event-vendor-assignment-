const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Try to get token from cookie first, then from Authorization header
  let token = req.cookies.token;
  
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.log('Auth failed: No token found');
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth success - User:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth failed: Invalid token', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const roleCheck = (role) => (req, res, next) => {
  console.log(`Role check: Required=${role}, User=${req.user?.role}`);
  if (req.user.role !== role) {
    console.log('Role check failed: Access denied');
    return res.status(403).json({ message: 'Access denied' });
  }
  console.log('Role check passed');
  next();
};

module.exports = { auth, roleCheck };
