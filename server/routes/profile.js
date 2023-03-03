const { Router } = require('express');
const router = Router();
const {
  userAuthorization,
  patientAuthorization,
  doctorAuthorization,
} = require('../middleware/authorization');
const {
  getProfile,
  getProfileDoctor,
  doctorsInformation,
  updateProfilePatient,
  updateProfileDoctor,
  updatePassword,
  addTopic,
  delTopic,
} = require('../controllers/profile');
const { rateLimitProtection } = require('../services/rate-limiter');

// /api/profile Submit your profile information (patient)
router.get('/', patientAuthorization, getProfile);

// /api/profile/doctor Submit your own profile information (doctor)
router.get('/doctor', doctorAuthorization, getProfileDoctor);

// /api/profile/doctors/:id Send doctor's information to general users.
router.get('/doctors/:id', doctorsInformation);

// /api/profile Profile update for patients
router.patch(
  '/',
  rateLimitProtection(10, 40),
  patientAuthorization,
  updateProfilePatient
);

// /api/profile/doctor Profile update for doctors
router.patch('/doctor', doctorAuthorization, updateProfileDoctor);

// /api/profile/password/change change password
router.patch('/password/change', userAuthorization, updatePassword);

// /api/profile/attentions/add Add a new topic of interest.
router.patch(
  '/attentions/add',
  rateLimitProtection(10, 50),
  userAuthorization,
  addTopic
);

// /api/profile/attentions/remove/:id Remove topics that interest you
router.delete('/attentions/remove/:id', userAuthorization, delTopic);

module.exports = router;
