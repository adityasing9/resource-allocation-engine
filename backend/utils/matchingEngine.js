/**
 * Smart Matching Engine
 *
 * Scores volunteers for a given task using a weighted formula:
 *
 *   Score = (skillWeight × skillMatch) + (distanceWeight × distanceScore) + (availabilityWeight × availabilityScore)
 *
 * Weights:
 *   - skillMatch:        0.5 (highest priority — must have the right skills)
 *   - distanceScore:     0.3 (closer volunteers preferred)
 *   - availabilityScore: 0.2 (available volunteers preferred)
 *
 * Urgency multiplier boosts scores for high-priority tasks:
 *   - High:   ×1.5
 *   - Medium: ×1.2
 *   - Low:    ×1.0
 *
 * Returns volunteers ranked by score (highest first).
 */

const WEIGHTS = {
  skill: 0.5,
  distance: 0.3,
  availability: 0.2
};

const URGENCY_MULTIPLIER = {
  High: 1.5,
  Medium: 1.2,
  Low: 1.0
};

/**
 * Calculate distance between two lat/lng points using the Haversine formula.
 * Returns distance in kilometers.
 */
function haversineDistance(loc1, loc2) {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate skill match ratio: how many required skills the volunteer has
 * Range: 0 (no match) to 1 (full match)
 */
function calcSkillMatch(volunteerSkills, requiredSkills) {
  if (requiredSkills.length === 0) return 1;

  // Normalize skills to lowercase for case-insensitive matching
  const volSkills = volunteerSkills.map(s => s.toLowerCase().trim());
  const reqSkills = requiredSkills.map(s => s.toLowerCase().trim());

  const matchCount = reqSkills.filter(skill => volSkills.includes(skill)).length;
  return matchCount / reqSkills.length;
}

/**
 * Calculate distance score: inverse relationship — closer is better
 * Uses formula: 1 / (1 + distance_km / 10)
 * Range: ~0 (very far) to 1 (same location)
 */
function calcDistanceScore(volunteerLocation, taskLocation) {
  const distance = haversineDistance(volunteerLocation, taskLocation);
  return 1 / (1 + distance / 10);
}

/**
 * Score a single volunteer for a given task
 * Returns an object with individual scores and the final weighted score (0–100)
 */
function scoreVolunteer(volunteer, task) {
  const skillMatch = calcSkillMatch(volunteer.skills, task.requiredSkills);
  const distanceScore = calcDistanceScore(volunteer.location, task.location);
  const availabilityScore = volunteer.availability ? 1 : 0;

  // Weighted sum
  const rawScore =
    WEIGHTS.skill * skillMatch +
    WEIGHTS.distance * distanceScore +
    WEIGHTS.availability * availabilityScore;

  // Apply urgency multiplier
  const urgencyMult = URGENCY_MULTIPLIER[task.urgency] || 1.0;
  const finalScore = Math.min(rawScore * urgencyMult * 100, 100);

  return {
    odId: volunteer._id,
    volunteerId: volunteer._id,
    volunteerName: volunteer.name,
    skillMatch: Math.round(skillMatch * 100),
    distanceScore: Math.round(distanceScore * 100),
    distanceKm: Math.round(haversineDistance(volunteer.location, task.location) * 10) / 10,
    availabilityScore: availabilityScore * 100,
    finalScore: Math.round(finalScore * 10) / 10,
    isAvailable: volunteer.availability
  };
}

/**
 * Find the best matching volunteers for a task
 * @param {Array} volunteers - Array of volunteer user documents
 * @param {Object} task - Task document
 * @param {Number} topN - Number of top matches to return (default: 5)
 * @returns {Array} Ranked array of scored volunteers
 */
function findBestMatches(volunteers, task, topN = 5) {
  const scored = volunteers
    .map(vol => scoreVolunteer(vol, task))
    .sort((a, b) => b.finalScore - a.finalScore);

  return scored.slice(0, topN);
}

module.exports = {
  findBestMatches,
  scoreVolunteer,
  haversineDistance,
  calcSkillMatch,
  calcDistanceScore,
  WEIGHTS,
  URGENCY_MULTIPLIER
};
