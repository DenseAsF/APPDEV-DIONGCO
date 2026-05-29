import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotifications, AppNotification } from '../../context/NotificationContext';

const STATUS_COLORS: Record<string, string> = {
  booked:      '#2e7d32',
  cancelled:   '#c62828',
  checked_in:  '#1D3599',
  checked_out: '#6a1b9a',
};

const STATUS_BG: Record<string, string> = {
  booked:      '#e8f5e9',
  cancelled:   '#ffebee',
  checked_in:  '#e8eaf6',
  checked_out: '#f3e5f5',
};

const NotificationItem = ({ item }: { item: AppNotification }) => (
  <View style={[styles.item, !item.read && styles.unread]}>
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: STATUS_BG[item.status] ?? '#f5f5f5' },
      ]}>
      <View
        style={[
          styles.statusDot,
          { backgroundColor: STATUS_COLORS[item.status] ?? '#999' },
        ]}
      />
      <Text
        style={[
          styles.statusLabel,
          { color: STATUS_COLORS[item.status] ?? '#999' },
        ]}>
        {item.status.replace('_', ' ').toUpperCase()}
      </Text>
    </View>
    <Text style={styles.itemTitle}>{item.title}</Text>
    <Text style={styles.itemMessage}>{item.message}</Text>
    <Text style={styles.itemDate}>
      {new Date(item.createdAt).toLocaleString()}
    </Text>
  </View>
);

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { notifications, markAllRead, clearAll } = useNotifications();

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D3599" />

      {/* Header — matches your app's blue header style */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            Booking updates will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D3599',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: { width: 50 },
  backText: { color: '#fff', fontSize: 22 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  clearButton: { width: 50, alignItems: 'flex-end' },
  clearText: { color: '#F2B622', fontSize: 14, fontWeight: '600' },
  list: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#1D3599',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemMessage: { fontSize: 13, color: '#555', lineHeight: 19 },
  itemDate: { fontSize: 11, color: '#9e9e9e', marginTop: 8 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9e9e9e',
    textAlign: 'center',
    lineHeight: 21,
  },
});