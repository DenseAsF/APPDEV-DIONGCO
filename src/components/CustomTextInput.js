import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const CustomTextInput = ({
  placeholder,
  label,
  value,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={containerStyle}>
      <Text>{label}</Text>
      <TextInput
        placeholder={placeholder}
        onChangeText={value}
        style={[
          textStyle,
          {
            borderBottomWidth: 1,
            borderColor: 'black',
            width: '100%',
          },
        ]}
      />
    </View>
  );
};

export default CustomTextInput;