const { Router } = require('express');
const {
  doctorAuthorization,
  patientAuthorization,
  userAuthorization,
} = require('../middleware/authorization');
const router = Router();

const {
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
  createQuestion,
  getRelatedQuestions,
  increaseQuestionView,
} = require('../controllers/questions');
const { rateLimitProtection } = require('../services/rate-limiter');

router.get('/related/:id', patientAuthorization, getRelatedQuestions);

router.post(
  '/create',
  rateLimitProtection(10, 20),
  userAuthorization,
  createQuestion
);

// /api/questions/latest Submit 5 recent questions that have been answered by doctors.
router.get('/latest', getLatest);

// /api/questions/doctor/interested Submit the most recent (unanswered) question of interest to the requesting physician.
router.get('/doctor/questions/interested', doctorAuthorization, getInterest);

// /api/questions/my-questions Submit questions the patient has previously asked.
router.get('/my-questions', patientAuthorization, getUserQuestions);

// /api/questions/:id send question information
router.get('/:id', getQuestion);

router.patch('/:id/views/increase', increaseQuestionView);

// /api/questions/:id/update The question owner edits the question.
router.patch(
  '/:id/update',
  rateLimitProtection(10, 30),
  patientAuthorization,
  updateQuestion
);

// /api/questions/:id The question owner deletes the question.
router.delete('/:id', patientAuthorization, delQuestion);

// /api/questions/:id/ban doctor banned_questions
router.delete('/:id/ban', doctorAuthorization, banQuestion);

// /api/questions/:id/answers response Answer to a specified question
router.get('/:id/answers', getAnswers);

// /api/questions/:id/answer
// Answer questions for the owner of the question and the doctors who have answered it.
router.post(
  '/:id/answers',
  rateLimitProtection(10, 40),
  userAuthorization,
  addAnswer
);

// /api/questions/:q_id/answers/:a_id/update The owner of the answer edits his own answer.
router.patch(
  '/:q_id/answers/:a_id/update',
  rateLimitProtection(10, 40),
  userAuthorization,
  updateAnswer
);

// /api/questions/:q_id/answers/:a_id/reply reply to answer
router.post(
  '/:q_id/answers/:a_id/reply',
  rateLimitProtection(10, 40),
  userAuthorization,
  replyAnswer
);

// /api/questions/:q_id/answers/:a_id The owner of the answer deletes the answer.
router.delete('/:q_id/answers/:a_id', delAnswer);

module.exports = router;
