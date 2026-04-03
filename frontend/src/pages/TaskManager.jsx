/**
 * Task Manager Page (Admin)
 * Full CRUD for tasks + auto-assign with match score visualization.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { ScoreBreakdownChart } from '../components/MatchScoreChart';

const SKILL_OPTIONS = [
  'First Aid', 'Medical', 'Driving', 'Communication', 'Construction',
  'Heavy Lifting', 'Cooking', 'Logistics', 'IT Support', 'Data Entry',
  'Counseling', 'Teaching', 'Plumbing', 'Electrical'
];

const INITIAL_FORM = {
  title: '',
  description: '',
  location: { lat: 28.6139, lng: 77.2090 },
  requiredSkills: [],
  urgency: 'Medium'
};

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create or update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setFormData(INITIAL_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Auto-assign
  const handleAutoAssign = async (taskId) => {
    try {
      const res = await api.post('/assign/auto', { taskId });
      setMatchResult(res.data);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Auto-assign failed');
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      location: task.location,
      requiredSkills: task.requiredSkills,
      urgency: task.urgency
    });
    setEditingId(task._id);
    setShowForm(true);
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  // Filter tasks
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Task Management</h1>
          <p className="text-dark-400 mt-1">Create, manage, and auto-assign tasks</p>
        </div>
        <button
          onClick={() => {
            setFormData(INITIAL_FORM);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="btn-primary"
          id="create-task-btn"
        >
          {showForm ? '✕ Close' : '+ Create Task'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-slide-down" id="task-form">
          <h3 className="text-lg font-semibold text-dark-200 mb-5">
            {editingId ? '✏️ Edit Task' : '📋 New Task'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="task-title" className="input-label">Title</label>
              <input
                id="task-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Emergency Medical Camp Setup"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="task-desc" className="input-label">Description</label>
              <textarea
                id="task-desc"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field min-h-[100px] resize-none"
                placeholder="Describe the task requirements..."
                required
              />
            </div>

            <div>
              <label htmlFor="task-lat" className="input-label">Latitude</label>
              <input
                id="task-lat"
                type="number"
                step="any"
                value={formData.location.lat}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, lat: parseFloat(e.target.value) || 0 }
                }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="task-lng" className="input-label">Longitude</label>
              <input
                id="task-lng"
                type="number"
                step="any"
                value={formData.location.lng}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, lng: parseFloat(e.target.value) || 0 }
                }))}
                className="input-field"
                required
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="input-label">Urgency Level</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      formData.urgency === level
                        ? level === 'High'
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : level === 'Medium'
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-accent-500/20 border-accent-500/50 text-accent-400'
                        : 'bg-dark-800/50 border-dark-600/50 text-dark-400 hover:border-dark-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div className="md:col-span-2">
              <label className="input-label">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`badge transition-all cursor-pointer ${
                      formData.requiredSkills.includes(skill)
                        ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50'
                        : 'bg-dark-700/50 text-dark-400 border border-dark-600/50 hover:border-dark-500'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Match Result */}
      {matchResult && (
        <div className="glass-card p-6 mb-8 animate-scale-in border-primary-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-200">⚡ Auto-Assignment Result</h3>
            <button
              onClick={() => setMatchResult(null)}
              className="text-dark-400 hover:text-dark-200"
            >✕</button>
          </div>
          <p className="text-sm text-accent-400 mb-4">{matchResult.message}</p>

          {/* Top match score breakdown */}
          {matchResult.assignedVolunteer && (
            <ScoreBreakdownChart match={matchResult.assignedVolunteer} />
          )}

          {/* All matches */}
          {matchResult.allMatches?.length > 1 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-dark-400 mb-2">All Candidates:</h4>
              <div className="space-y-2">
                {matchResult.allMatches.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                    <span className="text-sm text-dark-200">
                      {i === 0 && '🏆 '}{m.volunteerName}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-dark-400">
                      <span>Skill: {m.skillMatch}%</span>
                      <span>Dist: {m.distanceKm}km</span>
                      <span className="font-bold text-primary-400">{m.finalScore}pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'open', 'assigned', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'text-dark-400 hover:text-dark-300 hover:bg-dark-700/50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length})
          </button>
        ))}
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="spinner"></div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onAutoAssign={handleAutoAssign}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-dark-500">No tasks found</p>
        </div>
      )}
    </div>
  );
}
