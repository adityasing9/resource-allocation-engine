/**
 * Assignment Routes
 *
 * POST /api/assign/auto     — Auto-assign best volunteer to a task using matching engine
 * POST /api/assign/manual   — Manually assign a volunteer to a task
 * GET  /api/assign/overview — Get assignment statistics for admin dashboard
 */
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');
const { findBestMatches } = require('../utils/matchingEngine');
const { notifyUser, broadcast } = require('../utils/socket');

const router = express.Router();

/**
 * POST /api/assign/auto
 * Automatically find and assign the best volunteer for a task
 * Body: { taskId: string }
 */
router.post('/auto', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'taskId is required' });
    }

    // Get the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'open') {
      return res.status(400).json({ message: 'Task is already assigned or completed' });
    }

    // Get all available volunteers
    const volunteers = await User.find({ role: 'volunteer' });

    if (volunteers.length === 0) {
      return res.status(404).json({ message: 'No volunteers available' });
    }

    // Run matching engine to find best matches
    const matches = findBestMatches(volunteers, task, 5);

    if (matches.length === 0 || matches[0].finalScore === 0) {
      return res.status(404).json({
        message: 'No suitable volunteers found for this task',
        matches: []
      });
    }

    // Assign the top-scoring volunteer
    const bestMatch = matches[0];
    task.assignedTo = bestMatch.volunteerId;
    task.status = 'assigned';
    await task.save();

    // Notify the assigned volunteer via Socket.io
    notifyUser(bestMatch.volunteerId.toString(), 'task:assigned', {
      message: `You have been assigned to task: "${task.title}"`,
      taskId: task._id,
      taskTitle: task.title,
      urgency: task.urgency
    });

    // Broadcast assignment update
    broadcast('assignment:update', {
      taskId: task._id,
      volunteerId: bestMatch.volunteerId
    });

    res.json({
      message: 'Volunteer assigned successfully',
      assignedVolunteer: bestMatch,
      allMatches: matches,
      task
    });
  } catch (error) {
    console.error('Auto-assign error:', error);
    res.status(500).json({ message: 'Error during auto-assignment' });
  }
});

/**
 * POST /api/assign/manual
 * Manually assign a volunteer to a task
 * Body: { taskId: string, volunteerId: string }
 */
router.post('/manual', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { taskId, volunteerId } = req.body;

    if (!taskId || !volunteerId) {
      return res.status(400).json({ message: 'taskId and volunteerId are required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const volunteer = await User.findOne({ _id: volunteerId, role: 'volunteer' });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Assign volunteer to task
    task.assignedTo = volunteerId;
    task.status = 'assigned';
    await task.save();

    // Notify the volunteer
    notifyUser(volunteerId, 'task:assigned', {
      message: `You have been assigned to task: "${task.title}"`,
      taskId: task._id,
      taskTitle: task.title,
      urgency: task.urgency
    });

    res.json({
      message: 'Volunteer manually assigned',
      task: await task.populate('assignedTo', 'name email skills')
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during manual assignment' });
  }
});

/**
 * GET /api/assign/overview
 * Get assignment statistics for the admin dashboard
 */
router.get('/overview', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const [
      totalTasks,
      openTasks,
      assignedTasks,
      completedTasks,
      highUrgency,
      totalVolunteers,
      availableVolunteers
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'open' }),
      Task.countDocuments({ status: 'assigned' }),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ urgency: 'High', status: 'open' }),
      User.countDocuments({ role: 'volunteer' }),
      User.countDocuments({ role: 'volunteer', availability: true })
    ]);

    // Recent assignments
    const recentAssignments = await Task.find({ status: { $in: ['assigned', 'completed'] } })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalTasks,
        openTasks,
        assignedTasks,
        completedTasks,
        highUrgency,
        totalVolunteers,
        availableVolunteers
      },
      recentAssignments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overview' });
  }
});

module.exports = router;
