/**
 * Task Routes
 *
 * POST   /api/tasks             — Create task (admin)
 * GET    /api/tasks             — List all tasks
 * GET    /api/tasks/:id         — Get task details
 * PUT    /api/tasks/:id         — Update task (admin)
 * DELETE /api/tasks/:id         — Delete task (admin)
 * PATCH  /api/tasks/:id/complete — Mark task as completed (volunteer)
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { verifyToken, requireRole } = require('../middleware/auth');
const { notifyUser, broadcast } = require('../utils/socket');

const router = express.Router();

/**
 * POST /api/tasks
 * Create a new task — admin only
 */
router.post('/', verifyToken, requireRole('admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location.lat').isNumeric().withMessage('Location latitude is required'),
  body('location.lng').isNumeric().withMessage('Location longitude is required'),
  body('requiredSkills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('urgency').isIn(['Low', 'Medium', 'High']).withMessage('Urgency must be Low, Medium, or High')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, requiredSkills, urgency } = req.body;

    const task = await Task.create({
      title,
      description,
      location,
      requiredSkills,
      urgency,
      createdBy: req.user._id
    });

    // Broadcast new task to all connected clients
    broadcast('task:created', { task });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

/**
 * GET /api/tasks
 * List all tasks with optional status filter
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.urgency) filter.urgency = req.query.urgency;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email skills')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

/**
 * GET /api/tasks/:id
 * Get task details
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email skills location')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update a task — admin only
 */
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, location, requiredSkills, urgency } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, location, requiredSkills, urgency },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email skills');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task — admin only
 */
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    broadcast('task:deleted', { taskId: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

/**
 * PATCH /api/tasks/:id/complete
 * Mark a task as completed — volunteer only (must be assigned to them)
 */
router.patch('/:id/complete', verifyToken, requireRole('volunteer'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify the volunteer is assigned to this task
    if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this task' });
    }

    task.status = 'completed';
    await task.save();

    // Notify the admin who created the task
    notifyUser(task.createdBy.toString(), 'task:completed', {
      message: `Task "${task.title}" has been completed by ${req.user.name}`,
      taskId: task._id,
      completedBy: req.user.name
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error completing task' });
  }
});

module.exports = router;
