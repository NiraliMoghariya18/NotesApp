import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StyleProp,
  TextStyle,
} from 'react-native';
import { rf, rh } from '../utils/responsive';
import { colors } from '../utils/color';

interface Props {
  placeholderTextColor?: string;
  value: string;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  style: StyleProp<TextStyle>;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
}

const CustomInput = ({
  placeholderTextColor,
  value,
  placeholder,
  multiline,
  numberOfLines,
  style,
  error,
  label,
  onChangeText,
}: Props) => {
  return (
    <View style={styles.View}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        placeholderTextColor={placeholderTextColor}
        value={value}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[style]}
        onChangeText={onChangeText}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  errorText: { fontSize: rf(12), color: colors.red, marginTop: rh(5) },
  inputLabel: { fontSize: rf(14), marginBottom: rh(5) },
  View: { marginVertical: rh(15) },
});

export default CustomInput;
