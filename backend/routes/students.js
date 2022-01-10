const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadProfile,
  uploadProfileCloud,
} = require('../controllers/students');

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudent).put(updateStudent).delete(deleteStudent);
router.route('/:id/profile').post(uploadProfile);
router.route('/cloud/:id/profile').post(uploadProfileCloud);
module.exports = router;
