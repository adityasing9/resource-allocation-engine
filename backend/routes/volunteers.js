/**
 * Volunteer Routes
 *
 * GET  /api/volunteers           — List all volunteers (admin)
 * GET  /api/volunteers/dashboard — Volunteer's assigned tasks
 * GET  /api/volunteers/:id       — Get volunteer details
 * PUT  /api/volunteers/profile   — Update volunteer profile
 */
const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/volunteers
 * List all volunteers — admin only
 */
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('-password');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

/**
 * GET /api/volunteers/dashboard
 * Get tasks assigned to the current volunteer
 */
router.get('/dashboard', verifyToken, requireRole('volunteer'), async (req, res) => {
  try {
    const assignedTasks = await Task.find({ assignedTo: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      volunteer: {
        id: req.user._id,
        name: req.user.name,
        skills: req.user.skills,
        location: req.user.location,
        availability: req.user.availability
      },
      tasks: assignedTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard' });
  }
});

/**
 * GET /api/volunteers/:id
 * Get a specific volunteer's details
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const volunteer = await User.findOne({
      _id: req.params.id,
      role: 'volunteer'
    }).select('-password');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer' });
  }
});

/**
 * PUT /api/volunteers/profile
 * Update the current volunteer's profile (skills, location, availability)
 */
router.put('/profile', verifyToken, requireRole('volunteer'), async (req, res) => {
  try {
    const { skills, location, availability, name } = req.body;
    const updates = {};

    if (skills !== undefined) updates.skills = skills;
    if (location !== undefined) updates.location = location;
    if (availability !== undefined) updates.availability = availability;
    if (name !== undefined) updates.name = name;

    const volunteer = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
