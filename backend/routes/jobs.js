const express = require('express');
const router = express.Router();
const { Job, User, JobPhoto, Offer } = require('../models');

// @route   POST api/jobs
// @desc    Create a new job
// @access  Private (to be implemented)
router.post('/', async (req, res) => {
  try {
    const { customerId, title, location, status, basePrice, recurrence, scheduledAt, details, photos } = req.body;

    const newJob = await Job.create({
      customerId,
      title,
      location,
      status,
      basePrice,
      recurrence,
      scheduledAt,
      details
    });

    if (photos && photos.length > 0) {
      const photoPromises = photos.map(photoUrl => {
        return JobPhoto.create({ jobId: newJob.id, photoUrl });
      });
      await Promise.all(photoPromises);
    }

    const jobWithDetails = await Job.findByPk(newJob.id, {
      include: ['customer', 'photos']
    });

    res.status(201).json(jobWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all open jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { status: 'open' },
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] },
        { model: JobPhoto, as: 'photos', attributes: ['id', 'photoUrl'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get a single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] },
        { model: JobPhoto, as: 'photos' },
        { 
          model: Offer, 
          as: 'offers',
          include: [{ model: User, as: 'cleaner', attributes: ['id', 'name', 'email', 'phone'] }]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 