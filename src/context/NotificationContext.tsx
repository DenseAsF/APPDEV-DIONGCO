import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';

// Types defined locally to avoid any circular import issues
export type NotificationStatus =
  | 'booked'
  | 'pending'
  | 'cancelled'
  | 'checked_in'
  | 'checked_out';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  bookingId: string | number;
  status: NotificationStatus;
  read: boolean;
  createdAt: string;
}

type AddNotificationPayload = {
  title: string;
  message: string;
  bookingId: string | number;
  status: NotificationStatus;
};

type NotificationContextType = {
  notifications: AppNotification[];
  addNotification: (n: AddNotificationPayload) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(
    null,
  );
  const toastAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const addNotification = useCallback(
    (n: AddNotificationPayload) => {
      const newNotif: AppNotification = {
        ...n,
        id: `${Date.now()}-${Math.random()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);

      console.log('[NotificationContext] addNotification called:', n.title);

      if (isAnimating.current) {
        toastAnim.stopAnimation();
        toastAnim.setValue(0);
      }

      isAnimating.current = true;
      setToast({ title: n.title, message: n.message });

      Animated.sequence([
        Animated.timing(toastAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
        setToast(null);
      });
    },
    [toastAnim],
  );

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllRead,
        clearAll,
        unreadCount,
      }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast !== null && (
          <Animated.View
            style={[
              toastStyles.container,
              {
                opacity: toastAnim,
                transform: [
                  {
                    translateY: toastAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={toastStyles.title}>{toast.title}</Text>
            <Text style={toastStyles.message}>{toast.message}</Text>
          </Animated.View>
        )}
      </View>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
};

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: '#1D3599',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 9999,
  },
  title: {color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 2},
  message: {color: '#ffffffcc', fontSize: 13},
});