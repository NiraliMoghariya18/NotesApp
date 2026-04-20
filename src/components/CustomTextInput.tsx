// import React from 'react';
// import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
// import { rf } from '../utils/fonts';
// import { rh } from '../utils/responsive';
// import { TextInput } from 'react-native-paper';
// import colors from '../utils/color';

// interface CustomTextInputProps {
//   label: string;
//   value: string;
//   onChangeText?: (text: string) => void;
//   error?: string;
//   multiline?: boolean;
//   keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
//   editable?: boolean;
//   onFocus?: () => void;
//   onBlur?: () => void;
//   mode?: 'outlined' | 'flat';
//   contentStyle?: StyleProp<TextStyle>;
//   dense?: boolean;
//   right?: React.ReactNode;
//   style?: StyleProp<TextStyle>;
//   activeOutlineColor?: string;
// }

// const CustomTextInput: React.FC<CustomTextInputProps> = ({
//   label,
//   value,
//   onChangeText,
//   error,
//   multiline = false,
//   keyboardType = 'default',
//   editable = true,
//   onFocus,
//   onBlur,
//   mode,
//   contentStyle,
//   dense,
//   right,
//   style,
//   activeOutlineColor,
// }) => {
//   return (
//     <>
//       <TextInput
//         label={label}
//         value={value}
//         onChangeText={onChangeText}
//         multiline={multiline}
//         keyboardType={keyboardType}
//         editable={editable}
//         onFocus={onFocus}
//         onBlur={onBlur}
//         mode={mode}
//         style={[styles.input, style]}
//         dense={dense}
//         contentStyle={styles.contentstye}
//         right={right}
//         activeOutlineColor={activeOutlineColor || colors.primary}
//         underlineColor={colors.gray}
//         activeUnderlineColor={colors.primary}
//       />
//       <Text style={styles.errorText}>{error ? error : ' '}</Text>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     backgroundColor: colors.white,
//   },
//   errorText: {
//     color: colors.error,
//     fontSize: rf(12),
//     marginTop: rh(0.5),
//     marginBottom: rh(1),
//   },
//   contentstye: { fontSize: rf(13), textAlignVertical: 'center' },
// });

// export default CustomTextInput;
