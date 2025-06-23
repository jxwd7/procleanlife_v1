const express = require('express');
const router = express.Router();
const { Offer, Job, User } = require('../models');

// @route   POST api/offers
// @desc    Create a new offer
// @access  Private (cleaner only)
router.post('/', async (req, res) => {
  try {
    const { jobId, cleanerId, amount } = req.body;

    const newOffer = await Offer.create({
      jobId,
      cleanerId,
      amount,
      status: 'sent'
    });

    const offerWithDetails = await Offer.findByPk(newOffer.id, {
      include: [
        { model: Job, as: 'job', attributes: ['id', 'title', 'location'] },
        { model: User, as: 'cleaner', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.status(201).json(offerWithDetails);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// @route   GET api/offers/job/:jobId
// @desc    Get all offers for a specific job
// @access  Public
router.get('/job/:jobId', async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { jobId: req.params.jobId },
      include: [
        { model: User, as: 'cleaner', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// @route   GET api/offers/cleaner/:cleanerId
// @desc    Get all offers by a specific cleaner
// @access  Private
router.get('/cleaner/:cleanerId', async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { cleanerId: req.params.cleanerId },
      include: [
        { 
          model: Job, 
          as: 'job',
          include: [
            { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(offers);
  } catch (error) {
    console.error('Error fetching cleaner offers:', error);
    res.status(500).json({ error: 'Failed to fetch cleaner offers' });
  }
});

// @route   PUT api/offers/:id/accept
// @desc    Accept an offer
// @access  Private (customer only)
router.put('/:id/accept', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Update offer status
    await offer.update({ status: 'accepted' });

    // Update job status to assigned
    await Job.update(
      { status: 'assigned' },
      { where: { id: offer.jobId } }
    );

    // Reject all other offers for this job
    await Offer.update(
      { status: 'rejected' },
      { 
        where: { 
          jobId: offer.jobId,
          id: { [require('sequelize').Op.ne]: offer.id }
        }
      }
    );

    const updatedOffer = await Offer.findByPk(req.params.id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'cleaner', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.json(updatedOffer);
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({ error: 'Failed to accept offer' });
  }
});

// @route   PUT api/offers/:id/reject
// @desc    Reject an offer
// @access  Private (customer only)
router.put('/:id/reject', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    await offer.update({ status: 'rejected' });

    const updatedOffer = await Offer.findByPk(req.params.id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'cleaner', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    res.json(updatedOffer);
  } catch (error) {
    console.error('Error rejecting offer:', error);
    res.status(500).json({ error: 'Failed to reject offer' });
  }
});

module.exports = router; 