const express = require('express');
const router = express.Router();
const { User, Job, Offer } = require('../models');

// @route   GET api/users
// @desc    Get all users (for testing)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const whereClause = role ? { role } : {};

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isVerified', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isVerified', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// @route   GET api/users/:id/profile
// @desc    Get user profile with related data
// @access  Private
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isVerified', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let additionalData = {};

    if (user.role === 'customer') {
      // Get customer's jobs
      additionalData.jobs = await Job.findAll({
        where: { customerId: user.id },
        attributes: ['id', 'title', 'status', 'basePrice', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
      });
    } else if (user.role === 'cleaner') {
      // Get cleaner's offers
      additionalData.offers = await Offer.findAll({
        where: { cleanerId: user.id },
        include: [
          { 
            model: Job, 
            as: 'job',
            attributes: ['id', 'title', 'location', 'status'],
            include: [
              { model: User, as: 'customer', attributes: ['id', 'name'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });
    }

    res.json({
      user,
      ...additionalData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// @route   POST api/users
// @desc    Create a new user (registration)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      role,
      password, // In production, this should be hashed
      isVerified: false
    });

    // Don't return password
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone
    });

    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// @route   GET api/users/cleaners/available
// @desc    Get available cleaners
// @access  Public
router.get('/cleaners/available', async (req, res) => {
  try {
    const cleaners = await User.findAll({
      where: { 
        role: 'cleaner',
        isVerified: true
      },
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(cleaners);
  } catch (error) {
    console.error('Error fetching available cleaners:', error);
    res.status(500).json({ error: 'Failed to fetch available cleaners' });
  }
});

module.exports = router; 