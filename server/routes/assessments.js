const { Router } = require('express');
const router = Router();
const { patientAuthorization } = require('../middleware/authorization');
const {
  mental_test,
  covid_test,
  mental_result,
  covid_result,
} = require('../controllers/assessments');
const { rateLimitProtection } = require('../services/rate-limiter');

// /api/assessments/mental/create Get information from the assessment.
router.post(
  '/mental/create',
  rateLimitProtection(10, 30),
  patientAuthorization,
  mental_test
);

// /api/assessments/covid/create Get information from the assessment.
router.post(
  '/covid/create',
  rateLimitProtection(10, 30),
  patientAuthorization,
  covid_test
);

// /api/assessments/mental Submit a mental health assessment history to
router.get('/mental', patientAuthorization, mental_result);

// /api/assessments/covid Send your COVID risk assessment history to
router.get('/covid', patientAuthorization, covid_result);

module.exports = router;
