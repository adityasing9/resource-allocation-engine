/**
 * MatchScoreChart
 * Visualizes the matching score breakdown (skill, distance, availability)
 * using Recharts radar and bar charts.
 */
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#60a5fa'];

/**
 * Score breakdown bar chart for a single match
 */
export function ScoreBreakdownChart({ match }) {
  if (!match) return null;

  const data = [
    { name: 'Skill Match', score: match.skillMatch, fill: '#818cf8' },
    { name: 'Distance', score: match.distanceScore, fill: '#34d399' },
    { name: 'Availability', score: match.availabilityScore, fill: '#fbbf24' },
  ];

  return (
    <div className="glass-card p-5">
      <h4 className="text-sm font-semibold text-dark-200 mb-4">
        Score Breakdown — {match.volunteerName}
      </h4>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
          <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 text-center">
        <span className="text-2xl font-bold gradient-text">{match.finalScore}</span>
        <span className="text-sm text-dark-400 ml-1">/ 100 final score</span>
      </div>
    </div>
  );
}

/**
 * Task distribution pie chart for the admin dashboard
 */
export function TaskDistributionChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: 'Open', value: stats.openTasks || 0 },
    { name: 'Assigned', value: stats.assignedTasks || 0 },
    { name: 'Completed', value: stats.completedTasks || 0 },
  ];

  return (
    <div className="glass-card p-5">
      <h4 className="text-sm font-semibold text-dark-200 mb-4">Task Distribution</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreBreakdownChart;
