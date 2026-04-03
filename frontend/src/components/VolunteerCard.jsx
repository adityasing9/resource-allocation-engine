/**
 * VolunteerCard
 * Displays volunteer info with skills, availability, location, and distance.
 */
export default function VolunteerCard({ volunteer, matchScore }) {
  return (
    <div className="glass-card p-5 hover:border-dark-600/80 transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
            {volunteer.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-dark-100">{volunteer.name}</h3>
            <p className="text-xs text-dark-500">{volunteer.email}</p>
          </div>
        </div>
        <span className={`badge ${volunteer.availability
          ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
          : 'bg-dark-600/50 text-dark-400 border border-dark-500/30'
        }`}>
          {volunteer.availability ? '✓ Available' : '✗ Unavailable'}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {volunteer.skills?.map((skill, i) => (
          <span key={i} className="badge-skill">{skill}</span>
        ))}
        {(!volunteer.skills || volunteer.skills.length === 0) && (
          <span className="text-xs text-dark-500">No skills listed</span>
        )}
      </div>

      {/* Location */}
      <div className="text-xs text-dark-500 flex items-center gap-1">
        📍 {volunteer.location?.lat?.toFixed(3)}, {volunteer.location?.lng?.toFixed(3)}
      </div>

      {/* Match Score (if provided) */}
      {matchScore !== undefined && (
        <div className="mt-3 pt-3 border-t border-dark-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-dark-400">Match Score</span>
            <span className="text-sm font-bold text-primary-400">{matchScore}%</span>
          </div>
          <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
