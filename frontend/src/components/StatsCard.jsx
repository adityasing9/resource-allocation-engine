/**
 * StatsCard
 * Dashboard statistic card with icon, label, value, and optional trend/color.
 */
export default function StatsCard({ icon, label, value, color = 'primary', trend }) {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30 text-primary-400',
    accent: 'from-accent-500/20 to-accent-600/10 border-accent-500/30 text-accent-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  };

  const iconBg = {
    primary: 'bg-primary-500/20 text-primary-400',
    accent: 'bg-accent-500/20 text-accent-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className={`glass-card p-6 bg-gradient-to-br ${colorMap[color]} border hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-dark-100 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-accent-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${iconBg[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
