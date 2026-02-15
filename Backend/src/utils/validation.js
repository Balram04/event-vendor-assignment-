const validator = require("validator");

const validateSignUpData = (req) => {
  const { name, email, password, role } = req.body;
  if (!name || name.trim().length === 0) {
    throw new Error("Name is required!");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  } else if (!role || !['admin', 'vendor'].includes(role)) {
    throw new Error("Role must be either 'admin' or 'vendor'!");
  }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!email || !validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  } else if (!password || password.trim().length === 0) {
    throw new Error("Password is required!");
  }
};


module.exports = {
  validateSignUpData,
  validateLoginData,
};