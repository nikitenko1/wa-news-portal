const { connection } = require('../sql/mysql');
const { v4 } = require('uuid');

const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const getAllTopics = async (req, res) => {
  try {
    const q = `SELECT * FROM topics ORDER BY topic`;
    const topics = await connection.query(q);
    res.status(200).json({
      topics,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getPopularTopics = async (req, res) => {
  try {
    const q = `
        SELECT topics.id, topic FROM topics
        LEFT JOIN questions
        ON topics.id=questions.topic_id
        GROUP BY topics.id
        ORDER BY COUNT(questions.id) DESC
        LIMIT 5
    `;
    const topics = await connection.query(q);
    res.status(200).json({
      topics,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const createNewTopic = async (req, res) => {
  const { topic } = req.body;
  try {
    const q = `SELECT id FROM topics WHERE topic=?`;
    const [isExists] = await connection.query(q, [topic]);
    if (isExists) {
      return res.status(409).json({
        msg: 'This topic name already exists',
      });
    }
    const createTopicQuery = `INSERT INTO topics VALUES (?, ?)`;
    const getCreatedTopicQuery = `SELECT * FROM topics WHERE topic=?`;

    await connection.query(createTopicQuery, [v4(), topic]);
    const [createdTopic] = await connection.query(getCreatedTopicQuery, [
      topic,
    ]);

    res.status(201).json({
      topic: createdTopic,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const updateTopic = async (req, res) => {
  const { id } = req.params;
  const { topic } = req.body;
  try {
    await connection.query(`UPDATE topics SET topic=? WHERE id=?`, [topic, id]);
    res.status(204).json({ msg: 'updated successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const deleteTopic = async (req, res) => {
  const { id } = req.params;
  if (!id || id.trim() === '') {
    return res.status(400).json({
      msg: 'ID must be provided',
    });
  }
  try {
    const [topic] = await connection.query(`SELECT id FROM topics WHERE id=?`, [
      id,
    ]);
    if (!topic) {
      return res.status(409).json({
        msg: 'Topic not found',
      });
    }
    await connection.query('BEGIN');
    const blogImageIds = await connection.query(
      `
      SELECT image_id FROM blog_images 
      LEFT JOIN blogs ON blog_images.blog_id=blogs.id AND blogs.topic_id=?`,
      [id]
    );
    await connection.query(`DELETE FROM interested_in WHERE topic_id=?`, [id]);
    console.log('OK i');
    await connection.query(
      `
      DELETE FROM blog_images 
      WHERE blog_id IN (SELECT id FROM blogs WHERE topic_id=?)`,
      [id]
    );
    console.log('OK b i');
    await connection.query(`DELETE FROM blogs WHERE topic_id=?`, [id]);
    console.log('OK b');
    await connection.query(`DELETE FROM questions WHERE topic_id=?`, [id]);
    console.log('OK q');
    await connection.query(`DELETE FROM topics WHERE id=?`, [id]);

    res.status(204).json();

    for (let key of blogImageIds) {
      await cloudinary.v2.uploader.destroy(key.image_id);
    }
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const [topic] = await connection.query('SELECT * FROM topics WHERE id=?', [
      id,
    ]);
    if (!topic) {
      return res.status(404).json({
        msg: 'Not found',
      });
    }
    res.status(200).json({
      topic,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getTopicBlogs = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      msg: 'Topic not found',
    });
  }
  try {
    const query = `
        SELECT blogs.id, title, views, url, topic, created_at FROM blogs
        LEFT JOIN blog_images
        ON blogs.id=blog_images.blog_id
        LEFT JOIN topics
        ON blogs.topic_id=topics.id
        WHERE topics.id=?
        ORDER BY blogs.created_at DESC
        `;
    const blogs = await connection.query(query, [id]);
    res.status(200).json({
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getTopicQuestions = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      msg: 'Topic not found',
    });
  }
  try {
    const query = `
    SELECT questions.id, title, questions.content, users.name, profile_images.url, 
    COUNT(answers.question_id) AS answers, topic, questions.created_at FROM questions
    LEFT JOIN topics
    ON questions.topic_id=topics.id
    JOIN users
    ON questions.user_id=users.id
    LEFT JOIN profile_images
    ON users.id=profile_images.user_id
    LEFT JOIN answers
    ON questions.id=answers.question_id
    WHERE questions.topic_id=?
    GROUP BY answers.question_id
    HAVING COUNT(answers.id) > 0
    ORDER BY questions.created_at
    `;
    const questions = await connection.query(query, [id]);
    res.status(200).json({
      questions,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

module.exports = {
  getAllTopics,
  getPopularTopics,
  createNewTopic,
  updateTopic,
  deleteTopic,
  getTopic,
  getTopicBlogs,
  getTopicQuestions,
};
