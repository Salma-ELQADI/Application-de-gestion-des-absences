import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let idCounter = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++idCounter;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback((msg) => addNotification(msg, 'success'), [addNotification]);
  const error   = useCallback((msg) => addNotification(msg, 'error', 5000), [addNotification]);
  const info    = useCallback((msg) => addNotification(msg, 'info'), [addNotification]);
  const warning = useCallback((msg) => addNotification(msg, 'warning'), [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, success, error, info, warning, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
