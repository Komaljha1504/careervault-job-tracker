const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobStats,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

// Protect all routes under this router
router.use(protect);

// Routes
router.route('/')
  .get(getJobs)
  .post(createJob);

router.get('/stats', getJobStats);

router.route('/:id')
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
