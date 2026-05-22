import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import { ROUTES } from '../utils';

const AuthNav = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );  
};

export default AuthNav;
