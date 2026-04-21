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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import { ROUTES } from "../../utils";
import { login, register } from "../../app/api/auth";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    age: "",
  });
  
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    console.log('[RegisterScreen] input change', { field, valueLength: typeof value === 'string' ? value.length : null });
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    console.log('[RegisterScreen] validateForm start');
    if (!formData.username.trim()) {
      console.log('[RegisterScreen] validateForm fail: username required');
      Alert.alert("Error", "Username is required");
      return false;
    }
    if (!formData.name.trim()) {
      console.log('[RegisterScreen] validateForm fail: name required');
      Alert.alert("Error", "Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      console.log('[RegisterScreen] validateForm fail: email required');
      Alert.alert("Error", "Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      console.log('[RegisterScreen] validateForm fail: phone required');
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!formData.age.trim()) {
      console.log('[RegisterScreen] validateForm fail: age required');
      Alert.alert("Error", "Age is required");
      return false;
    }
    if (!formData.password.trim()) {
      console.log('[RegisterScreen] validateForm fail: password required');
      Alert.alert("Error", "Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      console.log('[RegisterScreen] validateForm fail: password mismatch');
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    console.log('[RegisterScreen] validateForm success');
    return true;
  };

  const handleRegister = async () => {
    console.log('[RegisterScreen] Create Account button pressed');
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("[RegisterScreen] Attempting register with:", {
        username: formData.username,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        age: formData.age,
      });
      console.log('[RegisterScreen] calling register()');
      const registerResult = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.age
      );
      console.log('[RegisterScreen] register() success', {
        keys: registerResult && typeof registerResult === 'object' ? Object.keys(registerResult) : null,
      });

      console.log('[RegisterScreen] calling login() after register');
      const loginResult = await login(formData.username, formData.password);
      console.log('[RegisterScreen] login() after register success', {
        keys: loginResult && typeof loginResult === 'object' ? Object.keys(loginResult) : null,
        hasToken: Boolean(loginResult?.token),
      });

      console.log('[RegisterScreen] navigating to HOME (reset stack)');
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HOME }],
      });
    } catch (error) {
      console.log("[RegisterScreen] Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/diningroom.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#1D3599" />
      
      <View style={styles.overlay} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <View style={styles.formContainer}>
          <Text style={styles.cardTitle}>Create Account</Text>

          <CustomTextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            containerStyle={styles.inputContainer}
          />

          <CustomTextInput
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={(value) => handleInputChange("username", value)}
            containerStyle={styles.inputContainer}
          />

          <CustomTextInput
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />

          <CustomTextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />

          <CustomTextInput
            label="Age"
            placeholder="Enter your age"
            value={formData.age}
            onChangeText={(value) => handleInputChange("age", value)}
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />

          <CustomTextInput
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <CustomTextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <CustomButton
            label={loading ? "Creating Account..." : "Create Account"}
            onPress={handleRegister}
            disabled={loading}
            containerStyle={styles.loginButton}
            textStyle={styles.buttonText}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text style={styles.registerLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 53, 153, 0.5)",
  },

  scrollContainer: {
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 40,
  },

  scrollView: {
    flex: 1,
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
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
    color: "#FFFFFF",
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
  },

  registerText: {
    color: "#666",
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },

  registerLink: {
    color: "#F2B622",
    fontWeight: "600",
    fontFamily: "Helvetica Neue LT Std",
    letterSpacing: 0.3,
  },
});
