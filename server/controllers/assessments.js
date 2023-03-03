const { connection } = require('../sql/mysql');
const { v4 } = require('uuid');

const mental_test = async (req, res) => {
  const userId = req.user.userId;
  const choose = req.body.choose;
  try {
    const id_v4 = v4();
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += choose[i];
    }
    const q = `
        INSERT INTO assessments (id,user_id,type,result	)
        VALUES ("${id_v4}","${userId}","MENTAL","${sum}")
        `;
    await connection.query(q);
    res.status(200).json({ result: sum });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const covid_test = async (req, res) => {
  const userId = req.user.userId;
  const choose = req.body.choose;
  try {
    const id_v4 = v4();
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += choose[i];
    }
    const q = `
        INSERT INTO assessments (id,user_id,type,result	)
        VALUES ("${id_v4}","${userId}","COVID","${sum}")
        `;
    await connection.query(q);
    res.status(200).json({ result: sum });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const mental_result = async (req, res) => {
  const userId = req.user.userId;
  try {
    const q = `
      SELECT  id,user_id,type,result,created_at	
      FROM  assessments
      WHERE  assessments.user_id="${userId}" and type="MENTAL" 
      ORDER BY created_at DESC;
    `;
    const assessments = await connection.query(q);
    res.status(200).json({
      assessments,
    });
  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
};

const covid_result = async (req, res) => {
  const userId = req.user.userId;
  try {
    const q = `
        SELECT  id, user_id, type, result, created_at	FROM assessments
        WHERE assessments.user_id="${userId}" and type="COVID" 
        ORDER BY created_at DESC;
        `;
    const assessments = await connection.query(q);
    res.status(200).json({
      assessments,
    });
  } catch (err) {
    res.status(500).send({
      msg: err.message,
    });
  }
};
module.exports = { mental_test, covid_test, mental_result, covid_result };
