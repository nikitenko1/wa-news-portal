const signinValidator = (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || email.trim().length === 0) {
      res.status(400).json({
        msg: 'Please fill in your email',
      });
    } else if (!password || password.trim().length === 0) {
      res.status(400).json({
        msg: 'Please enter your password',
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

module.exports = { signinValidator };
