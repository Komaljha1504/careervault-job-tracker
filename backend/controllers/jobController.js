const Job = require('../models/Job');

// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  const {
    companyName,
    jobTitle,
    location,
    dateApplied,
    interviewDate,
    status,
    jobUrl,
    notes
  } = req.body;

  try {
    const job = await Job.create({
      user: req.user._id,
      companyName,
      jobTitle,
      location,
      dateApplied: dateApplied || undefined,
      interviewDate: interviewDate || undefined,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all job applications (with search, status filter, and pagination)
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user._id };

    // Search by company name (or job title)
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get jobs and count
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ dateApplied: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get job statistics for dashboard
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format stats into an object
    const defaultStats = {
      Total: 0,
      Applied: 0,
      'Phone Screen': 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    let total = 0;
    stats.forEach((stat) => {
      if (defaultStats.hasOwnProperty(stat._id)) {
        defaultStats[stat._id] = stat.count;
      }
      total += stat.count;
    });
    defaultStats.Total = total;

    // Format data for charts (pie & bar charts)
    const chartData = Object.keys(defaultStats)
      .filter((key) => key !== 'Total')
      .map((key) => ({
        name: key,
        value: defaultStats[key],
      }));

    res.json({
      success: true,
      stats: defaultStats,
      chartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Ensure user owns job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this application' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Ensure user owns job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this application' });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job application deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobStats,
  updateJob,
  deleteJob,
};
