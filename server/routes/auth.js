const { Router } = require('express');
const router = Router();
const {
  login,
  signup,
  verify,
  logout,
  checkUser,
} = require('../controllers/auth');

const { signinValidator } = require('../validators/authValidators');
const { rateLimitProtection } = require('../services/rate-limiter');
const { userAuthorization } = require('../middleware/authorization');

router.post('/signin', signinValidator, login);

router.post('/signup', rateLimitProtection(10, 30), signup);

router.patch('/verify', verify);

router.get('/logout', logout);

router.get('/check-user', userAuthorization, checkUser);

module.exports = router;
