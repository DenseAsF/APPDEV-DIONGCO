import React, { useState } from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';

const LoginScreen = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (emailAdd !== 'Otin' || password !== 'Otin') {
      Alert.alert('Sayop Bih', 'Please try again');
      return;
    }
    navigation.navigate(ROUTES.HOME);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/c5/cb/52/c5cb5208f61643651ecabd64c3505014.jpg' }}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.inputCard}>
              <CustomTextInput
                label="Email Address"
                placeholder="Enter your email"
                value={emailAdd}
                onChangeText={setEmailAdd}
                containerStyle={styles.inputFieldContainer}
              />
              <CustomTextInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                containerStyle={styles.inputFieldContainer}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <CustomButton
                label="Login"
                onPress={handleLogin}
                containerStyle={styles.loginButton}
                textStyle={styles.buttonText}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 25,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    marginTop: '-%14',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  inputFieldContainer: {
    marginBottom: 15,
  },
  buttonWrapper: {
    width: '100%',
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 25,
    backgroundColor: '#010010',
  },
  loginButton: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;