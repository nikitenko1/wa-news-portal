const { connection } = require('../sql/mysql');

const createTopicValidator = (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic || topic.trim() === '') {
      res.status(400).json({
        msg: 'Please enter a topic name.',
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

const updateTopicValidator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topic } = req.body;

    if (!id || id.trim() === '') {
      res.status(400).json({
        msg: 'Please include the Topic ID',
      });
    } else if (!topic || topic.trim() === '') {
      res.status(400).json({
        msg: 'Please fill in the topic',
      });
    } else {
      const query = `SELECT * FROM topics WHERE id=?`;
      const [fetchedTopic] = await connection.query(query, [id]);

      if (!fetchedTopic) {
        return res.status(404).json({
          msg: 'The topic was not found',
        });
      }
      if (fetchedTopic.topic === topic) {
        return res.status(204).json();
      }
      const [isExists] = await connection.query(
        `SELECT * FROM topics WHERE topic=? AND id!=?`,
        [topic, id]
      );
      if (isExists) {
        return res.status(400).json({
          msg: 'This topic has already been used',
        });
      }
      next();
    }
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

module.exports = { createTopicValidator, updateTopicValidator };
