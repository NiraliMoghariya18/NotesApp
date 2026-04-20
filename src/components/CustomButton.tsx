//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from 'react-native';
import { colors } from '../utils/color';
import { rf, rh, rw } from '../utils/responsive';

// create a component
interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
}
const CustomButton = ({ label, onPress, style }: Props) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.blue,
    borderRadius: rw(20),
    marginTop: rh(15),
  },
  buttonText: {
    fontSize: rf(16),
    color: colors.white,
    textAlign: 'center',
    paddingVertical: rh(15),
  },
});

//make this component available to the app
export default CustomButton;
