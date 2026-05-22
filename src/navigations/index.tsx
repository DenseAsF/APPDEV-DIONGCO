import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';

import AuthNav from './AuthNavigations';
import MainNav from './MainNavigations';
import { selectIsAuthenticated } from '../app/selectors/authSelectors';

const Navigation = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? <MainNav /> : <AuthNav />}
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
