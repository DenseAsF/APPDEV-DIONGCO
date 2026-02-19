import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';

import { useEffect } from 'react';
import AuthNav from './AuthNavigations';

export default () => {
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