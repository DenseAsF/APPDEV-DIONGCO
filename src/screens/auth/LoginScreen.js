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
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import { ROUTES } from "../../utils";
import { login } from "../../app/api/auth";

const LoginScreen = () => {
  const [emailAdd, setEmailAdd] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

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

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log("Attempting login with username:", emailAdd);
      const result = await login(emailAdd, password);
      console.log("Login result:", result);
      
      setTimeout(() => {
        Alert.alert("Success", "Login successful!");
        navigation.navigate(ROUTES.HOME);
      }, 100);
    } catch (error) {
      console.log("Login error:", error);
      setTimeout(() => {
        Alert.alert("Login Failed", error.message || "Invalid email or password");
      }, 100);
    } finally {
      setLoading(false);
    }
  };

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
          label="Email"
          placeholder="Enter your email"
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
            onPress={() => navigation.navigate(ROUTES.REGISTER)}
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
    backgroundColor: "rgba(29, 53, 153, 0.5)",
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
    fontFamily: "Helvetica-Bold",
  },

  heroSubtitle: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: "Helvetica",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 40,
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
    fontFamily: "Helvetica",
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
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  registerText: {
    color: "#666",
  },

  registerLink: {
    color: "#F2B622",
    fontWeight: "600",
  },
});