import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const NotificationsContext = createContext(null);
const NOTIFICATIONS_STORAGE_KEY = "hireflow.notifications";

function normalizeNotification(item) {
  if (!item?.id || !item?.userId || !item?.title) return null;
  return {
    ...item,
    type: item.type || "info",
    message: item.message || "",
    jobId: item.jobId ?? null,
    applicationId: item.applicationId ?? item.relatedId ?? null,
    relatedId: item.relatedId ?? item.applicationId ?? null,
    route: item.route || null,
    isRead: Boolean(item.isRead),
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function mergeNotifications(...groups) {
  const seenIds = new Set();
  const seenEvents = new Set();
  return groups.flat()
    .map(normalizeNotification)
    .filter((notification) => {
      if (!notification || seenIds.has(notification.id)) return false;
      if (notification.dedupeKey && seenEvents.has(notification.dedupeKey)) return false;
      seenIds.add(notification.id);
      if (notification.dedupeKey) seenEvents.add(notification.dedupeKey);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [hasLoadedNotifications, setHasLoadedNotifications] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const notificationsRef = useRef([]);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
      .then((stored) => {
        let persisted = [];
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) persisted = parsed;
        }
        if (!active) return;
        const merged = mergeNotifications(notificationsRef.current, persisted);
        notificationsRef.current = merged;
        setNotifications(merged);
        setLoadError("");
      })
      .catch(() => {
        if (active) setLoadError("Saved notifications could not be loaded.");
      })
      .finally(() => {
        if (active) setHasLoadedNotifications(true);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hasLoadedNotifications) return;
    const snapshot = JSON.stringify(notifications);
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, snapshot))
      .then(() => setSaveError(""))
      .catch((error) => {
        setSaveError(
          error instanceof Error
            ? `Notifications could not be saved: ${error.message}`
            : "Notifications could not be saved.",
        );
      });
  }, [hasLoadedNotifications, notifications]);

  const updateNotifications = useCallback((updater) => {
    const next = mergeNotifications(updater(notificationsRef.current));
    notificationsRef.current = next;
    setNotifications(next);
  }, []);

  const addNotification = useCallback((details) => {
    if (!details?.userId || !details?.title) return null;
    if (
      details.dedupeKey &&
      notificationsRef.current.some((item) => item.dedupeKey === details.dedupeKey)
    ) {
      return notificationsRef.current.find((item) => item.dedupeKey === details.dedupeKey);
    }

    const notification = normalizeNotification({
      ...details,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    updateNotifications((current) => [notification, ...current]);
    return notification;
  }, [updateNotifications]);

  const getNotificationsForUser = useCallback(
    (userId) => notifications.filter((item) => item.userId === userId),
    [notifications],
  );

  const getUnreadCount = useCallback(
    (userId) => notifications.filter((item) => item.userId === userId && !item.isRead).length,
    [notifications],
  );

  const markAsRead = useCallback((notificationId, userId) => {
    if (!userId) return;
    updateNotifications((current) => current.map((item) =>
      item.id === notificationId && item.userId === userId
        ? { ...item, isRead: true }
        : item,
    ));
  }, [updateNotifications]);

  const markAllAsRead = useCallback((userId) => {
    if (!userId) return;
    updateNotifications((current) => current.map((item) =>
      item.userId === userId ? { ...item, isRead: true } : item,
    ));
  }, [updateNotifications]);

  const deleteNotification = useCallback((notificationId, userId) => {
    updateNotifications((current) => current.filter((item) =>
      item.id !== notificationId || item.userId !== userId,
    ));
  }, [updateNotifications]);

  const clearNotifications = useCallback((userId) => {
    if (!userId) return;
    updateNotifications((current) => current.filter((item) => item.userId !== userId));
  }, [updateNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        hasLoadedNotifications,
        loadError,
        saveError,
        addNotification,
        getNotificationsForUser,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
