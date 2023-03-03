const { v4 } = require('uuid');
const { connection } = require('../sql/mysql');

const getRelatedQuestions = async (req, res) => {
  const topicId = req.params.id;
  try {
    const q = `
        SELECT questions.id, title, questions.content, views, questions.created_at FROM questions
        LEFT JOIN answers
        ON questions.id=answers.question_id
        WHERE questions.topic_id=?
        GROUP BY answers.question_id 
        HAVING COUNT(answers.id)>0
        ORDER BY views DESC
    `;
    const questions = await connection.query(q, [topicId]);

    res.status(200).json({
      questions,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const increaseQuestionView = async (req, res) => {
  const qid = req.params.id;
  try {
    const q = `
    UPDATE questions SET views = views + 1 WHERE id=?
    `;
    await connection.query(q, [qid]);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// CREATE QUESTION - for patient
const createQuestion = async (req, res) => {
  const owner = req.user.userId;
  const qid = v4();
  const title = req.body.title;
  const content = req.body.content;
  const topic = req.body.topicId;
  try {
    const qry = `
    INSERT INTO questions VALUES('${qid}','${title}',"${content}",0,'${topic}','${owner}',NOW())
      `;
    await connection.query(qry);
    const interested_users = await connection.query(
      `
          SELECT users.id FROM users
          LEFT JOIN interested_in
          ON users.id=interested_in.user_id
          WHERE interested_in.topic_id=? AND users.role="DOCTOR"
      `,
      [topic]
    );
    for (let i = 0; i < interested_users.length; i++) {
      const ins = `
      INSERT INTO notifications VALUES ('${v4()}','QUESTION',NULL,'${qid}','${
        interested_users[i].id
      }',NOW())
          `;
      await connection.query(ins);
      await connection.query(
        `UPDATE users SET unread_notification = unread_notification+1 WHERE id="${interested_users[i].id}"`
      );
    }
    res.status(200).json({ msg: 'question created successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// LATEST QUESTION - 5 most latest question
const getLatest = async (req, res) => {
  try {
    const q = `
            SELECT q.id, q.title, q.content, t.topic, u.name, p.url, q.created_at,count(a.id) 
            as 'number_of_answers', (case when (count(a.id)>0) then TRUE else FALSE end) as 'status'
            FROM questions q, users u, answers a, topics t, profile_images p
            WHERE q.id = a.question_id
                and q.topic_id = t.id
                and q.user_id = u.id
                and u.id = p.user_id
            GROUP by q.id
            HAVING status = 1
            ORDER BY created_at DESC
            LIMIT 5
        `;
    const result = await connection.query(q);
    res.status(200).json({ questions: result });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// INTERESTED QUESTION - from what doctor interested in
const getInterest = async (req, res) => {
  const doctor = req.user.userId;
  try {
    const q = `
      SELECT questions.id, questions.title, questions.content, topics.topic, users.name, 
      profile_images.url,
      COUNT(answers.id) as "answers", questions.created_at FROM questions
      LEFT JOIN topics ON questions.topic_id=topics.id
      LEFT JOIN users ON questions.user_id=users.id
      LEFT JOIN profile_images ON users.id=profile_images.user_id
      LEFT JOIN answers ON questions.id=answers.question_id
      WHERE topics.id IN (SELECT topic_id FROM interested_in WHERE user_id="${doctor}")
      GROUP BY questions.id
      HAVING COUNT(answers.id)=0
      ORDER BY questions.created_at DESC
    `;
    const result = await connection.query(q);
    res.status(200).json({ questions: result });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// GET QUESTION - from question id
const getQuestion = async (req, res) => {
  const qid = req.params.id;
  try {
    const q = `
      SELECT q.id, q.title, q.content, q.views, q.user_id, u.name, u.birthday, p.url, 
      t.topic, t.id as topic_id, q.created_at
      FROM questions q, users u, profile_images p, topics t
      WHERE  q.user_id = u.id
      AND u.id = p.user_id
      AND q.id = '${qid}'
      AND q.topic_id = t.id
    `;
    const [result] = await connection.query(q);
    res.status(200).json({ question: result });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// GET USER'S QUESTIONS - all questions from specific patient
const getUserQuestions = async (req, res) => {
  const uid = req.user.userId;
  try {
    const q = `
      SELECT questions.id, questions.title, questions.content, topics.topic, questions.created_at, 
      COUNT(answers.id) as number_of_answers,
      (CASE WHEN COUNT(answers.id)>0 THEN TRUE ELSE FALSE END) as status
      FROM questions
      LEFT JOIN topics ON questions.topic_id=topics.id
      LEFT JOIN answers ON questions.id=answers.question_id
      WHERE questions.user_id="${uid}"
      GROUP BY questions.id
      ORDER BY created_at DESC
      `;
    const questions = await connection.query(q);
    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// UPDATE QUESTION - for owner
const updateQuestion = async (req, res) => {
  const qid = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const tid = req.body.topic_id;
  try {
    const q = `
    UPDATE questions SET title = '${title}', content = '${content}', topic_id = '${tid}'
    WHERE id='${qid}'
`;
    await connection.query(q);
    res.status(200).json({ msg: 'Update success' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// DELETE QUESTION - for owner
const delQuestion = async (req, res) => {
  const qid = req.params.id;
  try {
    const q = `
    DELETE FROM questions WHERE id = '${qid}'
   `;
    await connection.query(q);
    res.status(200).json({ msg: 'question deleted successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// BAN QUESTION - for doctors
const banQuestion = async (req, res) => {
  const nid = v4();
  const qid = req.params.id;
  try {
    const [question] = await connection.query(
      `SELECT user_id FROM questions WHERE id=?`,
      [qid]
    );
    await connection.query(
      'UPDATE users SET banned_questions = banned_questions+1 WHERE id=?',
      [question.user_id]
    );
    const q = `
      DELETE  FROM questions WHERE id = '${qid}'
    `;
    await connection.query(q);
    const ins = `
        INSERT INTO notifications VALUES ('${nid}','QUESTION_BANNED',NULL,NULL,"${question.user_id}",NOW())
        `;

    await connection.query(ins);
    await connection.query(
      `UPDATE users SET unread_notification = unread_notification+1 WHERE id="${question.user_id}"`
    );
    res.status(200).json({ msg: 'question banned' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// GET ANSWER - from question id
const getAnswers = async (req, res) => {
  const qid = req.params.id;
  try {
    const qry = `
          select a.id, a.content, a.user_id, u.name, u.role, p.url, a.created_at
          from questions q, answers a, users u, profile_images p
          where a.question_id = q.id
              and a.user_id = u.id
              and u.id = p.user_id
              and a.question_id = '${qid}'
          order by a.created_at
      `;
    const answers = await connection.query(qry);
    res.status(200).json({ answers });
  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
};

// ADD ANSWER - for owner and doctors
const addAnswer = async (req, res) => {
  const nid = v4();
  const ansId = v4();
  const qid = req.params.id;
  const content = req.body.content;
  const owner = req.user.userId;
  try {
    const [question] = await connection.query(
      `SELECT user_id FROM questions WHERE id=?`,
      [qid]
    );
    const qry = `
            insert into answers values ('${ansId}', '${qid}','"${content}"', NULL, '${owner}', NOW())
        `;
    const ins = `
    INSERT INTO notifications VALUES("${nid}","ANSWER",NULL,"${qid}","${question.user_id}",NOW())
  `;
    await connection.query(ins);

    await connection.query(qry);
    await connection.query(
      `UPDATE users SET unread_notification=unread_notification+1 WHERE id=?`,
      [question.user_id]
    );
    const query = `
      SELECT answers.id AS id, answers.user_id AS user_id, content, name, role, url, answers.created_at
      FROM answers
      LEFT JOIN users ON answers.user_id=users.id
      LEFT JOIN profile_images ON users.id=profile_images.user_id
      WHERE answers.id=?
    `;
    const [answer] = await connection.query(query, [ansId]);
    res.status(200).json({ answer, msg: 'added answer successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// UPDATE ANSWER - for owner of specific answer
const updateAnswer = async (req, res) => {
  const ansId = req.params.a_id;
  const content = req.body.content;
  try {
    const q = `
    UPDATE answers SET content = '${content}' WHERE id = '${ansId}'
  `;
    await connection.query(q);
    res.status(200).json({ msg: 'updated successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// REPLY ANSWER - for every user?

const replyAnswer = async (req, res) => {
  const ansId = v4();
  const nid = v4();
  const replied_answer = req.params.a_id;
  const qid = req.params.q_id;
  const thisOwner = req.user.userId;
  const content = req.body.content;
  try {
    const q = `
    INSERT INTO answers VALUES ('${ansId}', '${qid}', '${content}', '${replied_answer}',
    '${thisOwner}', NOW())
  `;
    const [answer] = await connection.query(
      `SELECT user_id FROM answers WHERE id="${replied_answer}"`
    );
    await connection.query(q);
    const ins = `
    INSERT INTO notifications VALUES ('${nid}','REPLY',NULL,'${qid}','${answer.user_id}',NOW())
  `;
    await connection.query(ins);

    const q2 = `SELECT answers.id AS answer_id, answers.user_id AS user_id, content, name, role, url,
    answers.created_at, replied_to
    FROM answers
    LEFT JOIN users ON answers.user_id=users.id
    LEFT JOIN profile_images ON users.id=profile_images.user_id
    WHERE answers.id=?`;

    const [replied] = await connection.query(q2, [ansId]);

    await connection.query(
      'UPDATE users SET unread_notification=unread_notification+1 WHERE id=?',
      [answer.user_id]
    );

    res.status(200).json({ answer: replied });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// DELETE ANSWER - for owner of specific answer

const delAnswer = async (req, res) => {
  const ansId = req.params.a_id;

  try {
    const q = `
    DELETE FROM answers WHERE id = '${ansId}'
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
  getRelatedQuestions,
  createQuestion,
  getLatest,
  getInterest,
  getQuestion,
  getUserQuestions,
  updateQuestion,
  delQuestion,
  banQuestion,
  getAnswers,
  addAnswer,
  updateAnswer,
  replyAnswer,
  delAnswer,
  increaseQuestionView,
};
