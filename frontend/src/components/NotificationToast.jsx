/**
 * NotificationToast
 * Renders real-time notification toasts in the bottom-right corner.
 * Auto-dismisses after 8 seconds with slide animation.
 */
import { useSocket } from '../context/SocketContext';

const ICONS = {
  assignment: '📌',
  completed: '✅',
  info: '💡',
  warning: '⚠️'
};

const COLORS = {
  assignment: 'border-primary-500/50 bg-primary-500/10',
  completed: 'border-accent-500/50 bg-accent-500/10',
  info: 'border-blue-500/50 bg-blue-500/10',
  warning: 'border-amber-500/50 bg-amber-500/10'
};

export default function NotificationToast() {
  const { notifications, dismissNotification } = useSocket();

  // Only show the latest 3 notifications as toasts
  const visibleToasts = notifications.slice(0, 3);

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {visibleToasts.map((notif) => (
        <div
          key={notif.id}
          className={`toast-enter glass-card p-4 border-l-4 ${COLORS[notif.type] || COLORS.info} shadow-2xl`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0 mt-0.5">
              {ICONS[notif.type] || '🔔'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark-100">{notif.title}</p>
              <p className="text-xs text-dark-400 mt-1 line-clamp-2">{notif.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="shrink-0 text-dark-500 hover:text-dark-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
