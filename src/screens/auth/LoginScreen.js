import React, { useState } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import { ROUTES } from "../../utils";
import { loginRequest } from "../../app/actions/authActions";
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from "../../app/selectors/authSelectors";

const LoginScreen = () => {
  const [emailAdd, setEmailAdd] = useState("");
  const [password, setPassword] = useState("");
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const validateForm = () => {
    if (!emailAdd.trim()) {
      Alert.alert("Error", "Email is required");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    dispatch(loginRequest({ username: emailAdd, password }));
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigation]);

  React.useEffect(() => {
    if (authError) {
      Alert.alert("Login Failed", authError);
    }
  }, [authError]);

  return (
    <ImageBackground
      source={require("../../../assets/images/hotelpatterned.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#1D3599" />

      <View style={styles.overlay} />

      <View style={styles.heroContainer}>
        <Image
          source={require("../../../assets/images/HOTEL LOGO.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.heroTitle}>HOTEL DIONGCO</Text>
        <Text style={styles.heroSubtitle}>
          Experience Luxury & Warmth
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In</Text>

        <CustomTextInput
          label="Username"
          placeholder="Enter your username"
          value={emailAdd}
          onChangeText={setEmailAdd}
          containerStyle={styles.inputContainer}
        />

        <CustomTextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          containerStyle={styles.inputContainer}
        />

        <CustomButton
          label={loading ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
          disabled={loading}
          containerStyle={styles.loginButton}
          textStyle={styles.buttonText}
        />

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ROUTES.REGISTER);
            }}
          >
            <Text style={styles.registerLink}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 20, 50, 0.6)",
  },

  heroContainer: {
    position: "absolute",
    top: 90,
    alignSelf: "center",
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },

  heroTitle: {
    fontSize: 25,
    color: "#FFFFFF",
    fontWeight: "",
    letterSpacing: 1,
    fontFamily: "Helvetica Neue LT Std",
  },

  heroSubtitle: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 40,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    color: "#1D3599",
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },

  inputContainer: {
    marginBottom: 15,
  },

  loginButton: {
    backgroundColor: "#1D3599",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    fontSize: 12
  },

  registerText: {
    color: "#666",
    fontSize: 12,
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },

  registerLink: {
    color: "#F2B622",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },
});