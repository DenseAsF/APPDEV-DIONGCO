import React from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({
  placeholder,
  label,
  value,
  onChangeText,
  textStyle,
  containerStyle,
  placeholderTextColor = 'rgba(0,0,0,0.3)',
}) => {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, textStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,                  // full outline
    borderColor: 'rgba(0,0,0,0.2)',  // light grey border
    borderRadius: 10,                // rounded corners
    width: '100%',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',         // optional: white input background
    color: '#000',
  },
});

export default CustomTextInput;