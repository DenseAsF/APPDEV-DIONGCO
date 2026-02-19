import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';

const LoginScreen = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CustomTextInput
        label={'Email Address'}
        placeholder={'Enter your email'}
        value={val => setEmailAdd(val)}
        containerStyle={{
          padding: 10,
          width: '80%',
        }}
        textStyle={{
          fontSize: 20,
        }}
      />

      <CustomTextInput
        label={'Password'}
        placeholder={'Enter your password'}
        value={val => setPassword(val)}
        containerStyle={{
          padding: 10,
          width: '80%',
        }}
        textStyle={{
          fontSize: 20,
        }}
      />

      <CustomButton
        label={'Login'}
        containerStyle={{
          width: '80%',
        }}
        textStyle={{
          textAlign: 'center',
        }}
        onPress={() => {
          if (emailAdd !== 'otin' || password !== 'otin') {
            Alert.alert('Incorrect credentials', 'Please try again');
            return;
          }
          navigation.navigate(ROUTES.HOME);
        }}
      />
    </View>
  );
};

export default LoginScreen;