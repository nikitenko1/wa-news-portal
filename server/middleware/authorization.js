const jwt = require('jsonwebtoken');

const userAuthorization = (req, res, next) => {
  const { token: token } = req.cookies;
  let decoded;
  if (!token)
    return res.status(401).json({ msg: 'No token, authorization denied.' });

  decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
  if (!decoded)
    return res
      .status(400)
      .json({ msg: 'You are not authorized to access this page' });
  req.user = {
    userId: decoded.userId,
  };

  next();
};

const patientAuthorization = (req, res, next) => {
  const { token: token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      msg: 'Unauthorized',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
    if (err) {
      return res.status(401).json({
        msg: 'Unauthorized',
      });
    }
    if (result.role !== 'PATIENT') {
      return res.status(403).json({
        msg: 'Access denied',
      });
    }
    req.user = {
      userId: result.userId,
    };
    next();
  });
};

const doctorAuthorization = (req, res, next) => {
  const { token: token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      msg: 'Cookie has expired. Please login.',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
    if (err) {
      return res.status(401).json({
        msg: 'Unauthorized',
      });
    }
    if (result.role !== 'DOCTOR') {
      return res.status(403).json({
        msg: 'Access denied',
      });
    }
    req.user = {
      userId: result.userId,
    };
    next();
  });
};

const adminAuthorization = (req, res, next) => {
  const { token: token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      msg: 'Unauthorized',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
    if (err) {
      return res.status(401).json({
        msg: 'Unauthorized',
      });
    }
    if (result.role !== 'ADMIN') {
      return res.status(403).json({
        msg: 'Access denied',
      });
    }
    req.user = {
      userId: result.userId,
    };
    next();
  });
};

module.exports = {
  userAuthorization,
  patientAuthorization,
  doctorAuthorization,
  adminAuthorization,
};
