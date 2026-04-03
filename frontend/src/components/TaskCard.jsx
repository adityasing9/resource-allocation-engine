/**
 * TaskCard
 * Displays a task with urgency badge, skills, location, status, and action buttons.
 */
export default function TaskCard({ task, onAutoAssign, onDelete, onComplete, showActions = true }) {
  const urgencyClass = {
    High: 'badge-high',
    Medium: 'badge-medium',
    Low: 'badge-low'
  };

  const statusClass = {
    open: 'badge-open',
    assigned: 'badge-assigned',
    completed: 'badge-completed'
  };

  return (
    <div className="glass-card p-5 hover:border-dark-600/80 transition-all duration-300 animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-dark-100 text-lg group-hover:text-primary-300 transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={urgencyClass[task.urgency]}>{task.urgency}</span>
          <span className={statusClass[task.status]}>{task.status}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-dark-400 mb-4 line-clamp-2">{task.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {task.requiredSkills?.map((skill, i) => (
          <span key={i} className="badge-skill">{skill}</span>
        ))}
      </div>

      {/* Location + Assigned */}
      <div className="flex items-center gap-4 text-xs text-dark-500 mb-4">
        <span className="flex items-center gap-1">
          📍 {task.location?.lat?.toFixed(3)}, {task.location?.lng?.toFixed(3)}
        </span>
        {task.assignedTo && (
          <span className="flex items-center gap-1">
            👤 {task.assignedTo.name || 'Assigned'}
          </span>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-dark-700/50">
          {task.status === 'open' && onAutoAssign && (
            <button
              onClick={() => onAutoAssign(task._id)}
              className="btn-primary text-xs !px-4 !py-2"
              id={`auto-assign-${task._id}`}
            >
              ⚡ Auto-Assign
            </button>
          )}
          {task.status === 'assigned' && onComplete && (
            <button
              onClick={() => onComplete(task._id)}
              className="btn-success text-xs !px-4 !py-2"
            >
              ✅ Mark Complete
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="btn-secondary text-xs !px-4 !py-2 hover:!bg-red-500/20 hover:!text-red-400 hover:!border-red-500/30"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
