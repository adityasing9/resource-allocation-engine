/**
 * SocketContext
 * Manages Socket.io connection and real-time notifications.
 * Auto-joins user's personal room on auth.
 */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Connect to Socket.io when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      // Join personal room
      newSocket.emit('join', user.id);
    });

    // Listen for task assignment notifications
    newSocket.on('task:assigned', (data) => {
      addNotification({
        type: 'assignment',
        title: 'New Task Assigned!',
        message: data.message,
        ...data
      });
    });

    // Listen for task completion notifications
    newSocket.on('task:completed', (data) => {
      addNotification({
        type: 'completed',
        title: 'Task Completed!',
        message: data.message,
        ...data
      });
    });

    // Listen for new task created
    newSocket.on('task:created', (data) => {
      addNotification({
        type: 'info',
        title: 'New Task Created',
        message: `A new task has been created`,
        ...data
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Add a notification to the list
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [{
      id,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    }, ...prev]);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Dismiss a single notification
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <SocketContext.Provider value={{
      socket,
      notifications,
      addNotification,
      clearNotifications,
      dismissNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
