const { connection } = require('../sql/mysql');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authEmail = require('../services/authEmail');
const sendEmail = require('../services/sendEmail');

let urls = {
  test: `http://localhost:3001`,
  development: `http://localhost:3000`,
  production: 'https://your-production-url.com',
};
const CLIENT_URL = urls[process.env.NODE_ENV];

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const q = `
      SELECT id, name, password, role, unread_notification, url FROM users
      LEFT JOIN profile_images ON id=user_id
      WHERE email=? AND is_verified=TRUE AND (banned_questions < 5 OR banned_questions IS NULL)
    `;
    const [user] = await connection.query(q, [email, password]);

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Wrong password',
      });
    }
    user.password = undefined;
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    // would expire after 60 minutes
    res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });

    res.status(200).json({
      msg: `Authenticated as ${user.name}`,
      user,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const signup = async (req, res) => {
  const { email, password, name, birthday } = req.body;
  try {
    const id = v4();
    const [result] = await connection.query(`
      SELECT * FROM users
      WHERE email = "${email}" AND is_verified=TRUE
      `);
    if (result) {
      return res.status(400).json({
        msg: 'This email address is already used',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const q = `
      INSERT INTO users (id, email, password, name, birthday, role) 
      VALUES("${id}", "${email}", "${hashedPassword}","${name}","${birthday}", "PATIENT"
    )`;
    await connection.query(q);

    const queryUnVerified = `
      DELETE FROM users WHERE email = "${email}" AND is_verified=FALSE`;
    setTimeout(async () => {
      await connection.query(queryUnVerified);
    }, 300000); // 5 min

    const token = jwt.sign(
      {
        id,
      },
      process.env.ACTIVATION_TOKEN_SECRET,
      {
        expiresIn: '5m',
      }
    );
    const url = `${CLIENT_URL}/verify/${token}`;

    const emailFormat = authEmail(
      `Hello, ${name}. Please verify the email address used with your GlobalPal account 
       by clicking this URL(Btn). 
       This URL is valid for 5 minutes.`,
      url
    );

    sendEmail(email, 'Please verify your email address', emailFormat)
      .then(() =>
        res.status(202).json({
          msg: `Email has been sent to ${email}, please verify your email`,
        })
      )
      .catch(() => {
        res.status(400).json(`Could not json({msg: an email to ${email}`);
      });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const verify = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({
        msg: 'Expired link or link is invalid. Please try again.',
      });
    }
    const [user] = await connection.query(
      `SELECT id, is_verified FROM users 
      WHERE id=?`,
      [decoded.id]
    );
    if (user.is_verified) {
      return res.status(409).json({
        msg: 'The account has been verified',
      });
    }

    await connection.query(`UPDATE users SET is_verified=TRUE WHERE id=?`, [
      decoded.id,
    ]);
    await connection.query(
      `INSERT INTO profile_images(user_id) VALUES ("${decoded.id}")`
    );
    res.status(200).json({
      msg: "Verified. Let's login",
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
};

const checkUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const q = `
      SELECT id,email,name,url,role FROM users
      LEFT JOIN profile_images
      ON users.id=profile_images.user_id
      WHERE id="${userId}"
`;

    const [user] = await connection.query(q);

    res.status(200).json({
      ...user,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

module.exports = { login, signup, verify, logout, checkUser };
