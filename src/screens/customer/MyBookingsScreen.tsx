import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { customerApi, Booking } from '../../services/customerApi';
import type { RootStackParamList } from '../../types/navigation';

type MyBookingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyBookings'>;

const MyBookingsScreen = () => {
  const navigation = useNavigation<MyBookingsScreenNavigationProp>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      const data = await customerApi.getBookings();
      console.log('[MyBookingsScreen] API Response:', JSON.stringify(data, null, 2));
      if (data.bookings && data.bookings.length > 0) {
        console.log('[MyBookingsScreen] First booking:', JSON.stringify(data.bookings[0], null, 2));
      }
      // Sort by newest first
      const sorted = data.bookings.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setBookings(sorted);
    } catch (error: any) {
      console.error('[MyBookingsScreen] Error loading bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleCancelBooking = (booking: Booking) => {
    const roomName = booking.room?.roomNumber || booking.room?.name || `Room ${booking.room?.id}`;
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for ${roomName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await customerApi.cancelBooking(booking.id);
              Alert.alert('Cancelled', 'Your booking has been cancelled.');
              loadBookings();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#888';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    // Map backend fields to frontend fields
    const roomName = item.room?.roomNumber || item.room?.name || `Room ${item.room?.id}`;
    const roomType = typeof item.room?.roomType === 'string' ? item.room.roomType : (item.room?.roomType?.name || item.room?.type || 'Standard');
    const checkIn = item.checkInDate || item.check_in || item.checkIn;
    const checkOut = item.checkOutDate || item.check_out || item.checkOut;
    const totalPrice = parseFloat(item.totalPrice as any) || item.total_price || 0;
    const specialRequests = item.special_requests || item.specialRequests;

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.roomName}>{roomName}</Text>
        <Text style={styles.roomType}>{roomType}</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{checkIn ? formatDate(checkIn) : 'N/A'}</Text>
          </View>
          <View style={styles.dateArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{checkOut ? formatDate(checkOut) : 'N/A'}</Text>
          </View>
        </View>

        {item.services && item.services.length > 0 && (
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Additional Services:</Text>
            {item.services.map((service) => (
              <Text key={service.id} style={styles.serviceItem}>
                • {service.name} (₱{(service.price || 0).toLocaleString()})
              </Text>
            ))}
          </View>
        )}

        {specialRequests && (
          <View style={styles.requestsContainer}>
            <Text style={styles.requestsLabel}>Special Requests:</Text>
            <Text style={styles.requestsText}>{specialRequests}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.totalPrice}>₱{totalPrice.toLocaleString()}</Text>
        
        {(item.status === 'pending' || item.status === 'confirmed' || item.status === 'Booked') && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(item)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1D3599" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>
              Start exploring our rooms and make your first booking!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Rooms')}
            >
              <Text style={styles.exploreButtonText}>Explore Rooms</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3599',
    padding: 20,
    backgroundColor: '#FFF',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  bookingId: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  roomName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3599',
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateArrow: {
    paddingHorizontal: 15,
  },
  arrowText: {
    fontSize: 20,
    color: '#1D3599',
  },
  servicesContainer: {
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  servicesLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  serviceItem: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
    marginTop: 2,
  },
  requestsContainer: {
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  requestsLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  requestsText: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F2B622',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    padding: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D3599',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#1D3599',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyBookingsScreen;
