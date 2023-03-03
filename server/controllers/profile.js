const { connection } = require('../sql/mysql');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const q = `
      SELECT id, email, name, url, birthday, role FROM users
      LEFT JOIN profile_images
      ON users.id=profile_images.user_id
      WHERE id="${userId}"
`;
    const queryInterested = `
      SELECT topics.id, topics.topic FROM interested_in
      LEFT JOIN topics
      ON topics.id=interested_in.topic_id
      WHERE interested_in.user_id="${userId}"
`;
    const [user] = await connection.query(q);
    const interested_in = await connection.query(queryInterested);

    res.status(200).json({
      ...user,
      interested_in,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getProfileDoctor = async (req, res) => {
  const userId = req.user.userId;
  try {
    const q = `
    SELECT id, email, name, url, personal_information FROM users
    LEFT JOIN profile_images
    ON users.id=profile_images.user_id
    WHERE id="${userId}"
    `;
    const queryInterested = `
    SELECT topics.id, topics.topic FROM interested_in
    LEFT JOIN topics
    ON interested_in.topic_id=topics.id
    WHERE interested_in.user_id="${userId}"
    `;
    const [user] = await connection.query(q);
    const interested_in = await connection.query(queryInterested);
    res.status(200).json({
      ...user,
      interested_in,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const doctorsInformation = async (req, res) => {
  const id = req.params.id;
  try {
    const query = `
        SELECT id, name, personal_information, url FROM users
        LEFT JOIN profile_images
        ON users.id=profile_images.user_id
        WHERE users.id="${id}"
    `;
    const [user] = await connection.query(query);
    const interested_in = await connection.query(`
        SELECT interested_in.topic_id, topics.topic FROM interested_in
        LEFT JOIN topics ON interested_in.topic_id=topics.id 
        WHERE interested_in.user_id="${id}"`);
    res.status(200).json({
      ...user,
      interested_in,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const updateProfilePatient = async (req, res) => {
  const userId = req.user.userId;
  const patient_name = req.body.name;
  const patient_birthday = req.body.birthday;
  try {
    const q = `
      UPDATE users SET users.name = "${patient_name}", users.birthday = "${patient_birthday}"
      WHERE users.id="${userId}";
  `;
    await connection.query(q);
    res.status(200).json({ msg: 'updated successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const updateProfileDoctor = async (req, res) => {
  const userId = req.user.userId;
  const doc_name = req.body.name;
  const doc_per_information = req.body.personal_information;
  try {
    const q = `
        UPDATE users SET users.name = "${doc_name}", users.personal_information = "${doc_per_information}"
        WHERE users.id="${userId}";
        `;
    await connection.query(q);
    res.status(200).json({ msg: 'updated successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.user.userId;
  const password_user = req.body.password;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_user, salt);

    const q = `
    UPDATE users SET users.password = "${hashedPassword}"
    WHERE users.id="${userId}";
    `;
    await connection.query(q);
    res.status(200).json({ msg: 'updated successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const insert = async (topics, userId) => {
  if (topics.length === 0) {
    return;
  }
  const q = `
    INSERT INTO interested_in (user_id,	topic_id) VALUES ("${userId}", "${
    topics[topics.length - 1]
  }")
    `;
  await connection.query(q);
  topics.pop();
  return insert(topics, userId);
};

const addTopic = async (req, res) => {
  const userId = req.user.userId;
  const topics = req.body.topics;
  try {
    await insert(topics, userId);

    const q = `
      SELECT topics.id, topics.topic FROM interested_in
      LEFT JOIN topics
      ON topics.id=interested_in.topic_id
      WHERE interested_in.user_id="${userId}"
    `;

    const interested_in = await connection.query(q);

    res.status(200).json({ msg: 'added successfully', interested_in });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const delTopic = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const q = `
      DELETE FROM interested_in 
      WHERE interested_in.user_id="${userId}" and  interested_in.topic_id= "${id}";
    `;

    await connection.query(q);

    res.status(200).json({ msg: 'deleted successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

module.exports = {
  getProfile,
  getProfileDoctor,
  doctorsInformation,
  updateProfilePatient,
  updateProfileDoctor,
  updatePassword,
  addTopic,
  delTopic,
};
