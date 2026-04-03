/**
 * Navbar
 * Navigation bar with role-based menu items, notification bell, and user menu.
 * Features glassmorphism styling and smooth animations.
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { notifications, clearNotifications, dismissNotification } = useSocket();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard', icon: '📊' },
        { to: '/tasks', label: 'Tasks', icon: '📋' },
        { to: '/map', label: 'Map', icon: '🗺️' },
      ]
    : [
        { to: '/volunteer', label: 'Dashboard', icon: '🏠' },
        { to: '/map', label: 'Map', icon: '🗺️' },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-t-0 border-x-0 rounded-none border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/volunteer'} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              SR
            </div>
            <span className="hidden sm:block font-bold text-lg gradient-text">
              SmartResource
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary-500/20 text-primary-300 shadow-inner'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/50'
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Notifications + User */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-700/50 transition-all"
                id="notification-bell"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 glass-card p-0 overflow-hidden animate-slide-down z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700/50">
                    <h3 className="font-semibold text-sm text-dark-200">Notifications</h3>
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="text-xs text-primary-400 hover:text-primary-300">
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-dark-500 text-center">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 border-b border-dark-800/50 hover:bg-dark-700/30 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-dark-200">{n.title}</p>
                              <p className="text-xs text-dark-400 mt-0.5">{n.message}</p>
                            </div>
                            <button
                              onClick={() => dismissNotification(n.id)}
                              className="text-dark-500 hover:text-dark-300 shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User info + logout */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-dark-200">{user?.name}</p>
                <p className="text-xs text-dark-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Logout"
                id="logout-btn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobile(!showMobile)}
              className="md:hidden p-2 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-700/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={showMobile ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobile && (
          <div className="md:hidden pb-4 animate-slide-down">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setShowMobile(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                  isActive(link.to)
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/50'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-2"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
