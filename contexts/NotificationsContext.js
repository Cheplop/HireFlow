import { createContext, useCallback, useContext, useState } from "react";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    ({ userId, title, message, type = "info", relatedId = null }) => {
      if (!userId) return null;

      const newNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        title,
        message,
        type,
        relatedId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification;
    },
    [],
  );

  const getNotificationsForUser = useCallback(
    (userId) => notifications.filter((item) => item.userId === userId),
    [notifications],
  );

  const getUnreadCount = useCallback(
    (userId) =>
      notifications.filter((item) => item.userId === userId && !item.isRead)
        .length,
    [notifications],
  );

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  }, []);

  const markAllAsRead = useCallback((userId) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.userId === userId ? { ...item, isRead: true } : item,
      ),
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        getNotificationsForUser,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}
