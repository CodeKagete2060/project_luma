import { useState, useEffect, useRef } from 'react';
import api from '../utils/axiosConfig';
import socket from '../utils/socket';

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount and when new ones arrive
  useEffect(() => {
    if (!userId) return;
    
    fetchNotifications();
    
    // Connect to socket and join user room
    socket.connect();
    socket.emit('join-room', userId);
    
    // Listen for real-time notifications
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    // Set up polling as fallback
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(interval);
      socket.off('notification');
      socket.disconnect();
    };
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${userId}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment_completed':
        return '✓';
      case 'milestone_achieved':
        return 'M';
      case 'tutor_feedback':
        return 'F';
      case 'new_assignment':
        return 'A';
      default:
        return 'N';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell icon with notification count */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                    !notification.read ? 'bg-[#2C139E]/10' : ''
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-start">
                    <span className="text-lg mr-3">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}