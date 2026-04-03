/**
 * Volunteer Dashboard
 * Shows volunteer's profile, assigned tasks, and availability toggle.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

export default function VolunteerDashboard() {
  const { user, updateUser } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/volunteers/dashboard');
      setDashData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle availability
  const toggleAvailability = async () => {
    try {
      const res = await api.put('/volunteers/profile', {
        availability: !user.availability
      });
      updateUser({
        ...user,
        availability: res.data.availability
      });
      setDashData(prev => ({
        ...prev,
        volunteer: { ...prev.volunteer, availability: res.data.availability }
      }));
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Mark task complete
  const handleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchDashboard(); // Refresh
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  const volunteer = dashData?.volunteer || user;
  const tasks = dashData?.tasks || [];
  const activeTasks = tasks.filter(t => t.status === 'assigned');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Volunteer Dashboard</h1>
        <p className="text-dark-400 mt-1">Your tasks and profile overview</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/25">
              {volunteer.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-100">{volunteer.name}</h2>
              <p className="text-sm text-dark-400">{user?.email}</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <button
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              volunteer.availability
                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30 hover:bg-accent-500/30'
                : 'bg-dark-700/50 text-dark-400 border border-dark-600/50 hover:bg-dark-600/50'
            }`}
            id="availability-toggle"
          >
            <div className={`w-3 h-3 rounded-full ${volunteer.availability ? 'bg-accent-400 animate-pulse-slow' : 'bg-dark-500'}`} />
            {volunteer.availability ? 'Available' : 'Unavailable'}
          </button>
        </div>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {volunteer.skills?.map((skill, i) => (
            <span key={i} className="badge-skill">{skill}</span>
          ))}
        </div>

        {/* Location */}
        <div className="mt-3 text-xs text-dark-500 flex items-center gap-1">
          📍 Location: {volunteer.location?.lat?.toFixed(4)}, {volunteer.location?.lng?.toFixed(4)}
        </div>
      </div>

      {/* Active Tasks */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow" />
          Active Tasks ({activeTasks.length})
        </h2>
        {activeTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleComplete}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-dark-500 text-sm">No active tasks assigned to you</p>
            <p className="text-dark-600 text-xs mt-1">Tasks will appear here when assigned by an admin</p>
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
            ✅ Completed Tasks ({completedTasks.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedTasks.map(task => (
              <TaskCard key={task._id} task={task} showActions={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
