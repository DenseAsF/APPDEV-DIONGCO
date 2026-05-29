import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';

import AuthNav from './AuthNavigations';
import MainNav from './MainNavigations';
import { selectIsAuthenticated } from '../app/selectors/authSelectors';
import { useMercureBookings } from '../hooks/useMercure';
import { useNotifications } from '../context/NotificationContext';

const GlobalMercureListener = () => {
  const { addNotification } = useNotifications();

  const handleBookingUpdate = useCallback((data: any) => {
    const booking = data?.booking;
    if (!booking) return;

    const status = booking.status;
    const bookingId = booking.id;
    const roomNumber = booking.room?.roomNumber ?? bookingId;

    console.log('[GlobalMercureListener] booking status:', status, '| id:', bookingId);

    let title = '';
    let message = '';
    let notifStatus: any = 'booked';

    switch (status) {
      case 'Booked':
        title = 'Booking Confirmed ✓';
        message = `Room ${roomNumber} has been booked.`;
        notifStatus = 'booked';
        break;
      case 'Checked In':
        title = 'Checked In 🏨';
        message = `Welcome! You have checked in to Room ${roomNumber}.`;
        notifStatus = 'checked_in';
        break;
      case 'Checked Out':
        title = 'Checked Out';
        message = `Thanks for your stay in Room ${roomNumber}!`;
        notifStatus = 'checked_out';
        break;
      case 'Cancelled':
        title = 'Booking Cancelled';
        message = `Your booking for Room ${roomNumber} has been cancelled.`;
        notifStatus = 'cancelled';
        break;
      default:
        console.log('[GlobalMercureListener] Unhandled status:', status);
        return;
    }

    addNotification({ title, message, bookingId, status: notifStatus });
  }, [addNotification]);

  useMercureBookings(handleBookingUpdate);
  return null;
};

const Navigation = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? (
          <>
            <GlobalMercureListener />
            <MainNav />
          </>
        ) : (
          <AuthNav />
        )}
      </NavigationContainer>
    </View>
  );
};

export default Navigation;