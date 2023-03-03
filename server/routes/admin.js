const { Router } = require('express');
const {
  getDoctors,
  createDoctor,
  getDoctor,
  getDoctorBlogs,
  removeDoctor,
  removeQuestions,
  aggregate,
} = require('../controllers/admin');
const router = Router();
const { adminAuthorization } = require('../middleware/authorization');

// /api/admin/doctors send all the doctors to
router.get('/doctors', adminAuthorization, getDoctors);

// /api/admin/doctors/:id Send the personal information of the specified doctor.
router.get('/doctors/:id', adminAuthorization, getDoctor);

// /api/admin/doctors/create add doctor account
router.post('/doctors/create', adminAuthorization, createDoctor);

// /api/admin/doctors/:id/blogs Send the specified doctor's block to
router.get('/doctors/:id/blogs', adminAuthorization, getDoctorBlogs);

// /doctors/:id delete doctor
router.delete('/doctors/:id', adminAuthorization, removeDoctor);

// /questions Remove questions that weren't answered by the doctor during the selected period.
// ?period=1week
router.delete('/questions/remove', adminAuthorization, removeQuestions);

router.get('/aggregate', adminAuthorization, aggregate);

module.exports = router;
