import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customerApi, Room } from '../../services/customerApi';
import type { RootStackParamList } from '../../types/navigation';

type CreateBookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateBooking'>;
type CreateBookingScreenRouteProp = RouteProp<RootStackParamList, 'CreateBooking'>;

const CreateBookingScreen = () => {
  const route = useRoute<CreateBookingScreenRouteProp>();
  const navigation = useNavigation<CreateBookingScreenNavigationProp>();
  const { roomId, room } = route.params;

  // Map backend fields to frontend fields
  const roomName = room.roomNumber || room.name || `Room ${room.id}`;
  const pricePerNight = room.price ? parseFloat(room.price) : (room.pricePerNight || 0);
  const maxPeople = room.maxPeople || room.capacity || 2;

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [guestCount, setGuestCount] = useState('1');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const calculateNights = () => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateTotal = () => {
    return calculateNights() * pricePerNight;
  };

  const handleDateChange = (
    _event: unknown,
    selectedDate: Date | undefined,
    isCheckIn: boolean
  ) => {
    if (Platform.OS === 'android') {
      setShowCheckIn(false);
      setShowCheckOut(false);
    }

    if (selectedDate) {
      if (isCheckIn) {
        setCheckIn(selectedDate);
        // Ensure check-out is after check-in
        if (selectedDate >= checkOut) {
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setCheckOut(nextDay);
        }
      } else {
        setCheckOut(selectedDate);
      }
    }
  };

  const validateBooking = (): boolean => {
    if (checkOut <= checkIn) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return false;
    }

    const nights = calculateNights();
    if (nights < 1) {
      Alert.alert('Error', 'Minimum 1 night stay required');
      return false;
    }

    const guests = parseInt(guestCount, 10);
    if (isNaN(guests) || guests < 1) {
      Alert.alert('Error', 'Please enter a valid number of guests');
      return false;
    }

    if (guests > maxPeople) {
      Alert.alert('Error', `Maximum ${maxPeople} guests allowed for this room`);
      return false;
    }

    return true;
  };

  const handleCreateBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      const booking = await customerApi.createBooking({
        room_id: roomId,
        check_in: formatDate(checkIn),
        check_out: formatDate(checkOut),
        guestCount: parseInt(guestCount, 10),
        specialRequests: specialRequests.trim() || undefined,
      });

      Alert.alert(
        'Booking Confirmed!',
        `Your booking for ${roomName} has been created.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => navigation.navigate('MyBookings'),
          },
          {
            text: 'Continue Browsing',
            onPress: () => navigation.navigate('Rooms'),
          },
        ]
      );
    } catch (error: any) {
      console.error('[CreateBookingScreen] Error creating booking:', error);
      Alert.alert('Booking Failed', error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.roomSummary}>
        <Text style={styles.roomName}>{roomName}</Text>
        <Text style={styles.roomType}>{room.roomType?.name || room.type || 'Standard'}</Text>
        <Text style={styles.roomPrice}>₱{pricePerNight.toLocaleString()} / night</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Dates</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCheckIn(true)}
            >
              <Text style={styles.dateText}>{formatDate(checkIn)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCheckOut(true)}
            >
              <Text style={styles.dateText}>{formatDate(checkOut)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showCheckIn && (
          <DateTimePicker
            value={checkIn}
            mode="date"
            minimumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, true)}
          />
        )}

        {showCheckOut && (
          <DateTimePicker
            value={checkOut}
            mode="date"
            minimumDate={new Date(checkIn.getTime() + 86400000)}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, false)}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Number of Guests (max {maxPeople})</Text>
          <TextInput
            style={styles.input}
            value={guestCount}
            onChangeText={setGuestCount}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Special Requests (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            numberOfLines={4}
            placeholder="Any special requests or requirements..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price per night</Text>
          <Text style={styles.summaryValue}>₱{pricePerNight.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of nights</Text>
          <Text style={styles.summaryValue}>{calculateNights()}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of guests</Text>
          <Text style={styles.summaryValue}>{guestCount}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₱{calculateTotal().toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, loading && styles.bookButtonDisabled]}
        onPress={handleCreateBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  roomSummary: {
    backgroundColor: '#1D3599',
    padding: 20,
    paddingTop: 60,
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  roomType: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'capitalize',
  },
  roomPrice: {
    fontSize: 18,
    color: '#F2B622',
    marginTop: 10,
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
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 15,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 5,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3599',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F2B622',
  },
  bookButton: {
    backgroundColor: '#F2B622',
    margin: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#CCC',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});

export default CreateBookingScreen;
