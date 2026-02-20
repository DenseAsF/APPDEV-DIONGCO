import { Image, Text, View } from 'react-native';
import { IMG } from '../../utils';

const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={{
          uri: IMG.LOGO,
        }}
        style={{ width: 200, height: 200 }}
      />

      
      <Text style={{ fontSize: 20 }}>Epstein the financier</Text>
      <Text style={{ fontSize: 10 }}>he is very bad.</Text>
    </View>
  );
};

export default HomeScreen;