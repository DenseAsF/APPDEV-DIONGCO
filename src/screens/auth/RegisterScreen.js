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
import { register } from "../../app/api/auth";

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert("Error", "Username is required");
      return false;
    }
    if (!formData.name.trim()) {
      Alert.alert("Error", "Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!formData.age.trim()) {
      Alert.alert("Error", "Age is required");
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert("Error", "Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("Attempting register with:", {
        username: formData.username,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        age: formData.age,
      });
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.age
      );
      Alert.alert(
        "Welcome to Hotel Diongco!",
        "Your account has been created successfully. Please sign in to continue.",
        [
          {
            text: "Sign In",
            onPress: () => navigation.navigate(ROUTES.LOGIN)
          }
        ]
      );
    } catch (error) {
      console.log("Registration error:", error);
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
    color: "#FFFFFF",
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
