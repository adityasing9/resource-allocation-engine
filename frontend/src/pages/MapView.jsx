/**
 * Map View Page
 * Displays tasks and volunteers as markers on a Leaflet map.
 * Clicking a marker shows details in a popup.
 */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for tasks and volunteers
const taskIcon = (urgency) => new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: bold;
    background: ${urgency === 'High' ? '#ef4444' : urgency === 'Medium' ? '#f59e0b' : '#10b981'};
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    color: white;
  ">📋</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20]
});

const volunteerIcon = (available) => new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    background: ${available ? '#6366f1' : '#64748b'};
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    color: white;
  ">👤</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20]
});

// Component to fit map bounds to markers
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [positions, map]);

  return null;
}

export default function MapView() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes] = await Promise.all([
        api.get('/tasks')
      ]);
      setTasks(tasksRes.data);

      // Fetch volunteers only if admin
      if (isAdmin) {
        const volRes = await api.get('/volunteers');
        setVolunteers(volRes.data);
      }
    } catch (err) {
      console.error('Error fetching map data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Collect all positions for bounds fitting
  const allPositions = [
    ...(showTasks ? tasks.map(t => [t.location.lat, t.location.lng]) : []),
    ...(showVolunteers ? volunteers.map(v => [v.location.lat, v.location.lng]) : [])
  ].filter(p => p[0] !== 0 || p[1] !== 0);

  // Default center (New Delhi)
  const center = allPositions.length > 0
    ? [allPositions[0][0], allPositions[0][1]]
    : [28.6139, 77.2090];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Map View</h1>
          <p className="text-dark-400 mt-1">Visualize tasks and volunteers on the map</p>
        </div>

        {/* Toggle Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowTasks(!showTasks)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              showTasks
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-dark-700/50 text-dark-400 border border-dark-600/50'
            }`}
          >
            📋 Tasks ({tasks.length})
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowVolunteers(!showVolunteers)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                showVolunteers
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-dark-700/50 text-dark-400 border border-dark-600/50'
              }`}
            >
              👥 Volunteers ({volunteers.length})
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4 mb-4 flex flex-wrap gap-6 text-xs text-dark-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" /> High Urgency
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" /> Medium Urgency
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent-500" /> Low Urgency
        </div>
        {isAdmin && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary-500" /> Volunteer (Available)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-dark-500" /> Volunteer (Unavailable)
            </div>
          </>
        )}
      </div>

      {/* Map */}
      <div className="glass-card overflow-hidden" style={{ height: '550px' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {allPositions.length > 0 && <FitBounds positions={allPositions} />}

          {/* Task Markers */}
          {showTasks && tasks.map(task => (
            <Marker
              key={`task-${task._id}`}
              position={[task.location.lat, task.location.lng]}
              icon={taskIcon(task.urgency)}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#e2e8f0' }}>
                    {task.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    {task.description?.slice(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      background: task.urgency === 'High' ? 'rgba(239,68,68,0.2)' : task.urgency === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                      color: task.urgency === 'High' ? '#f87171' : task.urgency === 'Medium' ? '#fbbf24' : '#34d399'
                    }}>
                      {task.urgency}
                    </span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      background: 'rgba(59,130,246,0.2)', color: '#60a5fa'
                    }}>
                      {task.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>
                    Skills: {task.requiredSkills?.join(', ')}
                  </p>
                  {task.assignedTo && (
                    <p style={{ fontSize: '11px', color: '#818cf8', marginTop: '4px' }}>
                      Assigned: {task.assignedTo.name}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Volunteer Markers */}
          {showVolunteers && volunteers.map(vol => (
            <Marker
              key={`vol-${vol._id}`}
              position={[vol.location.lat, vol.location.lng]}
              icon={volunteerIcon(vol.availability)}
            >
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px', color: '#e2e8f0' }}>
                    {vol.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    {vol.email}
                  </p>
                  <span style={{
                    padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                    background: vol.availability ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)',
                    color: vol.availability ? '#34d399' : '#94a3b8'
                  }}>
                    {vol.availability ? 'Available' : 'Unavailable'}
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    Skills: {vol.skills?.join(', ') || 'None'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
