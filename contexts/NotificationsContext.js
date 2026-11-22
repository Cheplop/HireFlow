import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const NotificationsContext = createContext(null);
const NOTIFICATIONS_STORAGE_KEY = "hireflow.notifications";
const SEEDED_USERS_STORAGE_KEY = "hireflow.notifications.seeded";

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [hasLoadedNotifications, setHasLoadedNotifications] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
      .then((stored) => {
        if (!stored || cancelled) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHasLoadedNotifications(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedNotifications) return;
    AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications),
    ).catch(() => {});
  }, [notifications, hasLoadedNotifications]);

  const seedDefaultNotifications = useCallback(
    async (user) => {
      if (!hasLoadedNotifications || !user?.id || !user?.role) return;

      const userId = String(user.id);
      try {
        const rawSeeded = await AsyncStorage.getItem(SEEDED_USERS_STORAGE_KEY);
        const seededUsers = rawSeeded ? JSON.parse(rawSeeded) : {};
        if (seededUsers[userId]) return;

        const now = Date.now();
        const dummyItems =
          user.role === "employer"
            ? [
                {
                  id: `notif-seed-emp-1-${userId}`,
                  userId,
                  senderId: null,
                  title: "New Application Received",
                  message:
                    "Maria Santos applied for Frontend React Native Developer.",
                  type: "application",
                  relatedId: null,
                  isRead: false,
                  createdAt: new Date(now - 12 * 60000).toISOString(),
                },
                {
                  id: `notif-seed-emp-2-${userId}`,
                  userId,
                  senderId: null,
                  title: "Applicant Profile Updated",
                  message:
                    "Carlos Reyes updated his availability and portfolio details.",
                  type: "application",
                  relatedId: null,
                  isRead: true,
                  createdAt: new Date(now - 3 * 3600000).toISOString(),
                },
              ]
            : [
                {
                  id: `notif-seed-app-1-${userId}`,
                  userId,
                  senderId: null,
                  title: "Application Accepted",
                  message:
                    "Your application for UI/UX Mobile Designer at HireFlow Studio was marked as Accepted.",
                  type: "status",
                  relatedId: null,
                  isRead: false,
                  createdAt: new Date(now - 18 * 60000).toISOString(),
                },
                {
                  id: `notif-seed-app-2-${userId}`,
                  userId,
                  senderId: null,
                  title: "Application Under Review",
                  message:
                    "TechBridge Solutions viewed your application for Junior Software Engineer.",
                  type: "status",
                  relatedId: null,
                  isRead: true,
                  createdAt: new Date(now - 5 * 3600000).toISOString(),
                },
              ];

        seededUsers[userId] = true;
        await AsyncStorage.setItem(
          SEEDED_USERS_STORAGE_KEY,
          JSON.stringify(seededUsers),
        );

        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const toAdd = dummyItems.filter((n) => !existingIds.has(n.id));
          return [...prev, ...toAdd];
        });
      } catch {
        // Ignore storage seed errors
      }
    },
    [hasLoadedNotifications],
  );

  const addNotification = useCallback(
    ({
      userId,
      senderId = null,
      title,
      message,
      type = "info",
      relatedId = null,
    }) => {
      if (!userId) return null;

      const newNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId: String(userId),
        senderId: senderId ? String(senderId) : null,
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
    (userId) =>
      notifications.filter((item) => String(item.userId) === String(userId)),
    [notifications],
  );

  const getUnreadCount = useCallback(
    (userId) =>
      notifications.filter(
        (item) => String(item.userId) === String(userId) && !item.isRead,
      ).length,
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
        String(item.userId) === String(userId)
          ? { ...item, isRead: true }
          : item,
      ),
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        hasLoadedNotifications,
        seedDefaultNotifications,
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
