import { Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ containerStyle, textStyle, label, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;