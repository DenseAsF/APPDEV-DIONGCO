import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import HomeScreen from '../screens/main/HomeScreen';
import {
  RoomsScreen,
  RoomDetailScreen,
  CreateBookingScreen,
  MyBookingsScreen,
  ProfileScreen,
} from '../screens/customer';

import { ROUTES } from '../utils';

const MainNav = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.HOME}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1D3599' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Main Screens */}
      <Stack.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ROOMS}
        component={RoomsScreen}
        // options={{ title: 'Available Rooms' }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ROOM_DETAIL}
        component={RoomDetailScreen}
        options={{ title: 'Room Details', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.CREATE_BOOKING}
        component={CreateBookingScreen}
        options={{ title: 'Book Room', headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.MY_BOOKINGS}
        component={MyBookingsScreen}
        // options={{ title: 'My Bookings' }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ title: 'My Profile', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
