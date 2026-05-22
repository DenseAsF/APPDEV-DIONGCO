import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { customerApi, Room } from '../../services/customerApi';
import type { RootStackParamList } from '../../types/navigation';

type RoomsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Rooms'>;

const RoomsScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<RoomsScreenNavigationProp>();

  const loadRooms = async () => {
    try {
      const data = await customerApi.getRooms({ available: true });
      console.log('[RoomsScreen] API Response:', JSON.stringify(data, null, 2));
      console.log('[RoomsScreen] Rooms array:', data.rooms);
      if (data.rooms && data.rooms.length > 0) {
        console.log('[RoomsScreen] First room:', JSON.stringify(data.rooms[0], null, 2));
      }
      setRooms(data.rooms);
    } catch (error: any) {
      console.error('[RoomsScreen] Error loading rooms:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };

  const renderRoom = ({ item }: { item: Room }) => {
    // Map backend fields to frontend fields
    const name = item.roomNumber || item.name || `Room ${item.id}`;
    const type = item.roomType?.name || item.type || 'Standard';
    const capacity = item.maxPeople || item.capacity || 2;
    const price = item.price ? parseFloat(item.price) : (item.pricePerNight || 0);
    const isAvailable = item.status?.name === 'Available' || item.isAvailable || false;
    
    return (
      <TouchableOpacity
        style={styles.roomCard}
        onPress={() => navigation.navigate('RoomDetail', { roomId: item.id })}
      >
        <View style={styles.roomContent}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{name}</Text>
            <Text style={styles.roomType}>{type}</Text>
            {item.description && (
              <Text style={styles.roomDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <View style={styles.roomDetails}>
              <Text style={styles.capacity}>👥 {capacity} guests</Text>
              {item.amenities && item.amenities.length > 0 && (
                <Text style={styles.amenities} numberOfLines={1}>
                  ✨ {item.amenities.slice(0, 3).join(', ')}
                </Text>
              )}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱{price.toLocaleString()}</Text>
              <Text style={styles.perNight}>/night</Text>
            </View>
          </View>
          <View style={[styles.availabilityBadge, !isAvailable && styles.bookedBadge]}>
            <Text style={styles.availabilityText}>
              {isAvailable ? 'Available' : 'Booked'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1D3599" />
        <Text style={styles.loadingText}>Loading rooms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Rooms</Text>
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rooms available at the moment</Text>
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
  },
  roomCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomContent: {
    padding: 15,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3599',
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    lineHeight: 18,
  },
  roomDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  capacity: {
    fontSize: 13,
    color: '#555',
  },
  amenities: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F2B622',
  },
  perNight: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  availabilityBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bookedBadge: {
    backgroundColor: '#F44336',
  },
  availabilityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default RoomsScreen;
