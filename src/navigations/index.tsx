import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';

import AuthNav from './AuthNavigations';

const Navigation = () => {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthNav />
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
