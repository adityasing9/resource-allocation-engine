/**
 * Register Page
 * Signup form with role selection, skills input, and location picker.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SKILL_OPTIONS = [
  'First Aid', 'Medical', 'Driving', 'Communication', 'Construction',
  'Heavy Lifting', 'Cooking', 'Logistics', 'IT Support', 'Data Entry',
  'Counseling', 'Teaching', 'Plumbing', 'Electrical'
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer',
    skills: [],
    location: { lat: 28.6139, lng: 77.2090 }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        skills: formData.skills,
        location: formData.location
      });
      navigate(user.role === 'admin' ? '/admin' : '/volunteer');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-950 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-primary-500/30 mb-4">
            SR
          </div>
          <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
          <p className="text-dark-400 mt-2">Join the Smart Resource Platform</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8" id="register-form">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-scale-in">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="input-label">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['volunteer', 'admin'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role }))}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                      formData.role === role
                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                        : 'bg-dark-800/50 border-dark-600/50 text-dark-400 hover:border-dark-500'
                    }`}
                  >
                    {role === 'admin' ? '🛡️ Admin' : '🙋 Volunteer'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="input-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="input-label">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-password" className="input-label">Password</label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••"
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-confirm" className="input-label">Confirm</label>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {/* Skills (for volunteers) */}
            {formData.role === 'volunteer' && (
              <div>
                <label className="input-label">Skills (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`badge transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50'
                          : 'bg-dark-700/50 text-dark-400 border border-dark-600/50 hover:border-dark-500'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {formData.role === 'volunteer' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="input-label">Latitude</label>
                  <input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.location.lat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lat: parseFloat(e.target.value) || 0 }
                    }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="lng" className="input-label">Longitude</label>
                  <input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.location.lng}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lng: parseFloat(e.target.value) || 0 }
                    }))}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
              id="register-submit"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
