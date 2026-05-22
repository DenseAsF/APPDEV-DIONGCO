import React from 'react';
import { Text, View, TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  placeholder?: string;
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  placeholderTextColor?: string;
}

const CustomTextInput = ({
  placeholder,
  label,
  value,
  onChangeText,
  textStyle,
  containerStyle,
  inputStyle,
  placeholderTextColor = 'rgba(0,0,0,0.3)',
  ...rest
}: CustomTextInputProps) => {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, textStyle, inputStyle]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: 'Helvetica Neue LT Std',
    color: '#000',
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    width: '100%',
    fontSize: 12,
    fontFamily: 'Helvetica Neue LT Std',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#000',
    letterSpacing: 0.3,
  },
});

export default CustomTextInput;
