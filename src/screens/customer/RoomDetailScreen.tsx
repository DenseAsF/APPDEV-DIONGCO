import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { customerApi, Room } from '../../services/customerApi';
import type { RootStackParamList } from '../../types/navigation';

type RoomDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoomDetail'>;
type RoomDetailScreenRouteProp = RouteProp<RootStackParamList, 'RoomDetail'>;

const RoomDetailScreen = () => {
  const route = useRoute<RoomDetailScreenRouteProp>();
  const navigation = useNavigation<RoomDetailScreenNavigationProp>();
  const { roomId } = route.params;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const data = await customerApi.getRoom(roomId);
      setRoom(data);
    } catch (error: any) {
      console.error('[RoomDetailScreen] Error loading room:', error);
      Alert.alert('Error', 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Check both frontend isAvailable and backend status.name
    const available = room?.isAvailable || room?.status?.name === 'Available';
    if (available) {
      navigation.navigate('CreateBooking', { roomId, room });
    } else {
      Alert.alert('Not Available', 'This room is currently booked.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1D3599" />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Room not found</Text>
      </View>
    );
  }

  // Map backend fields to frontend fields
  const name = room.roomNumber || room.name || `Room ${room.id}`;
  const type = room.roomType?.name || room.type || 'Standard';
  const capacity = room.maxPeople || room.capacity || 2;
  const price = room.price ? parseFloat(room.price) : (room.pricePerNight || 0);
  const isAvailable = room.status?.name === 'Available' || room.isAvailable || false;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.roomName}>{name}</Text>
          <Text style={styles.roomType}>{type}</Text>
          <View style={[styles.availabilityBadge, !isAvailable && styles.bookedBadge]}>
            <Text style={styles.availabilityText}>
              {isAvailable ? '✓ Available' : '✗ Booked'}
            </Text>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {room.description || 'No description available.'}
          </Text>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Capacity</Text>
              <Text style={styles.detailValue}>{capacity} guests</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price per Night</Text>
              <Text style={styles.detailValue}>₱{price.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {room.amenities && room.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {room.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>• {amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price per night</Text>
          <Text style={styles.priceValue}>₱{price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, !isAvailable && styles.bookButtonDisabled]}
          onPress={handleBookNow}
          disabled={!isAvailable}
        >
          <Text style={styles.bookButtonText}>
            {isAvailable ? 'Book Now' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1D3599',
    padding: 20,
    paddingTop: 60,
  },
  roomName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  roomType: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'capitalize',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  section: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3599',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amenityText: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#888',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F2B622',
  },
  bookButton: {
    backgroundColor: '#F2B622',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  bookButtonDisabled: {
    backgroundColor: '#CCC',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
  },
});

export default RoomDetailScreen;
