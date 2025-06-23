const express = require('express');
const router = express.Router();
const { Message, User, Job } = require('../models');

// @route   POST api/messages
// @desc    Send a new message
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, jobId, content } = req.body;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      jobId,
      content
    });

    const messageWithDetails = await Message.findByPk(newMessage.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] },
        { model: User, as: 'receiver', attributes: ['id', 'name'] },
        { model: Job, as: 'job', attributes: ['id', 'title'] }
      ]
    });

    res.status(201).json(messageWithDetails);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// @route   GET api/messages/conversation/:userId1/:userId2
// @desc    Get conversation between two users
// @access  Private
router.get('/conversation/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { jobId } = req.query;

    const whereClause = {
      [require('sequelize').Op.or]: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    };

    if (jobId) {
      whereClause.jobId = jobId;
    }

    const messages = await Message.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] },
        { model: User, as: 'receiver', attributes: ['id', 'name'] },
        { model: Job, as: 'job', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// @route   GET api/messages/job/:jobId
// @desc    Get all messages for a specific job
// @access  Private
router.get('/job/:jobId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { jobId: req.params.jobId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] },
        { model: User, as: 'receiver', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching job messages:', error);
    res.status(500).json({ error: 'Failed to fetch job messages' });
  }
});

// @route   GET api/messages/user/:userId
// @desc    Get all conversations for a user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get latest message from each conversation
    const messages = await Message.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] },
        { model: User, as: 'receiver', attributes: ['id', 'name'] },
        { model: Job, as: 'job', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group by conversation (sender-receiver-job combination)
    const conversations = {};
    messages.forEach(message => {
      const otherUserId = message.senderId === parseInt(userId) ? message.receiverId : message.senderId;
      const conversationKey = `${Math.min(userId, otherUserId)}-${Math.max(userId, otherUserId)}-${message.jobId}`;
      
      if (!conversations[conversationKey]) {
        conversations[conversationKey] = {
          otherUser: message.senderId === parseInt(userId) ? message.receiver : message.sender,
          job: message.job,
          lastMessage: message,
          unreadCount: 0 // This would need proper implementation with read status
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    res.status(500).json({ error: 'Failed to fetch user conversations' });
  }
});

module.exports = router; 