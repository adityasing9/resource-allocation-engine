/**
 * Admin Dashboard
 * Shows stats cards, task distribution chart, and recent assignments.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { TaskDistributionChart } from '../components/MatchScoreChart';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/assign/overview');
      setOverview(res.data);
    } catch (err) {
      console.error('Error fetching overview:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = overview?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
        <p className="text-dark-400 mt-1">Overview of resource allocation and task management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard icon="📋" label="Total Tasks" value={stats.totalTasks || 0} color="primary" />
        <StatsCard icon="👥" label="Active Volunteers" value={stats.availableVolunteers || 0} color="accent" />
        <StatsCard icon="🔴" label="Urgent Tasks" value={stats.highUrgency || 0} color="red" />
        <StatsCard icon="✅" label="Completed" value={stats.completedTasks || 0} color="blue" />
      </div>

      {/* Charts + Recent Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution Chart */}
        <TaskDistributionChart stats={stats} />

        {/* Secondary Stats */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-200 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-sm text-dark-400">Open Tasks</span>
              <span className="text-lg font-bold text-blue-400">{stats.openTasks || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-sm text-dark-400">Assigned Tasks</span>
              <span className="text-lg font-bold text-amber-400">{stats.assignedTasks || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-sm text-dark-400">Total Volunteers</span>
              <span className="text-lg font-bold text-primary-400">{stats.totalVolunteers || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
              <span className="text-sm text-dark-400">Available Now</span>
              <span className="text-lg font-bold text-accent-400">{stats.availableVolunteers || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="mt-8 glass-card p-6">
        <h3 className="text-sm font-semibold text-dark-200 mb-4">Recent Assignments</h3>
        {overview?.recentAssignments?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">Task</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">Assigned To</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentAssignments.map(task => (
                  <tr key={task._id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td className="py-3 px-4 text-dark-200">{task.title}</td>
                    <td className="py-3 px-4 text-dark-300">{task.assignedTo?.name || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`badge-${task.status}`}>{task.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={task.urgency === 'High' ? 'badge-high' : task.urgency === 'Medium' ? 'badge-medium' : 'badge-low'}>
                        {task.urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-dark-500 text-center py-8">No assignments yet</p>
        )}
      </div>
    </div>
  );
}
