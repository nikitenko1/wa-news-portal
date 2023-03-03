const jwt = require('jsonwebtoken');
const User = require('./user');
const bcrypt = require('bcrypt');
const authEmail = require('../services/authEmail');
const forgetEmail = require('../services/forgetEmail');
const sendEmail = require('../services/sendEmail');
const shortid = require('shortid');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

let urls = {
  test: `http://localhost:3001`,
  development: 'http://localhost:3000',
  production: 'https://your-production-url.com',
};
const CLIENT_URL = urls[process.env.NODE_ENV];

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('verified');

    if (user && user.verified) {
      return res.status(400).json({
        msg: 'The email address has already been used to register',
      });
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      const token = jwt.sign({ email }, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: '5m',
      });
      const username = shortid.generate();
      const newUser = new User({
        email,
        username,
        password: passwordHash,
      });

      await newUser.save();

      const url = `${CLIENT_URL}/activate-account/${token}`;

      const emailFormat = authEmail(
        `Hi, ${email}, Please click the following URL to verify your email.  
      This URL is valid for 5 minutes.`,
        url
      );

      sendEmail(email, 'Complete your registration.', emailFormat)
        .then(() =>
          res.status(202).json({
            msg: `Email has been sent to ${email}.
          Please check your email to verify your identity.`,
          })
        )
        .catch(() => {
          res.status(400).json(`Could not json({msg: an email to ${email}`);
        });
    }
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({
        msg: 'Expired link or link is invalid. Please try again.',
      });
    }
    const { email } = decoded;

    const user = await User.findOne({ email }).select('verified');

    if (!user) {
      return res.status(404).json({
        msg: `User not found`,
      });
    }
    if (user.verified) {
      return res.status(400).json({
        msg: `This user has been verified`,
      });
    }
    user.verified = true;

    await user.save();

    res.status(200).json({
      msg: "Verified. Let's login",
    });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, verified: true }).select(
      'password username profileImage role unreadMessage unreadNotification'
    );

    if (!user) {
      return res.status(400).json({ msg: 'Email or password is invalid' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email or password is invalid' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    user.password = undefined;

    res.cookie('token', token, {
      httpOnly: true,
    });
    res.status(200).json({
      msg: `Authenticated as role: ${user.role}`,
      token,
      user,
    });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.getLoggedInUser = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id).select(
      'username profileImage unreadMessage unreadNotification role'
    );

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select('_id');

    if (!user) {
      return res.status(404).json({ msg: `Could not found ${email}.` });
    }

    const random = Math.floor(Math.random() * (999999 - 100000) + 100000);
    user.security.otp = random;
    user.security.expirationTime = Date.now() + 60 * 5 * 1000; // 5 minutes

    const header = 'Complete your password resetting procedure.';

    const emailFormat = forgetEmail(header, random);
    // async (to, subject, content)
    await sendEmail(req.body.email, 'Reset your password.', emailFormat)
      .then(() =>
        res.status(202).json({
          msg: `Email has been sent to ${email}. Please click on the link that we sent to resetting your password.`,
        })
      )

      .catch(() => {
        res.status(400).json({
          msg: `Could not send an email to ${email}`,
        });
      });
    await user.save();
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({ email }).select('email security');

    if (!user) {
      return res.status(400).json({ msg: `Can't find that email` });
    }
    if (user.security.otp === '') {
      return res.status(400).json({ msg: `I haven't sent OTP yet` });
    }
    if (user.security.otp != otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }
    if (user.security.expirationTime < Date.now()) {
      (user.security.otp = ''), await user.save();
      return res.status(400).json({ msg: 'OTP has expired. Please try again' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    user.password = passwordHash;
    user.security.otp = '';
    await user.save();

    res.json({
      msg: "Reset password successfully. Let's login",
    });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
};
