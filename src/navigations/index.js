import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';

import AuthNav from './AuthNavigations';

export default () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthNav />
      </NavigationContainer>
    </View>
  );
};