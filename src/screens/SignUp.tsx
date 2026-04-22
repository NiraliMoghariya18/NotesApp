import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { rw, rh, rf } from '../utils/responsive';
import { useAppDispatch } from '../redux/store';
import { images } from '../utils/image';
import { createSignUpUsers } from '../redux/slice/authSlice';
import { RootStackParamList } from '../types/navgationTyeps';
import { strings } from '../utils/strings';
import { colors } from '../utils/color';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';

interface Error {
  email?: string;
  password?: string;
  name?: string;
}

const SignUp = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Error>({});

  const validate = () => {
    const newErrors: Error = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onLogin = async () => {
    if (!validate()) return;

    try {
      await dispatch(createSignUpUsers({ name, email, password }));
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'SignUp User',
          error?.response?.data?.message || 'Something went wrong!',
        );
      } else {
        console.error('Non-Axios error:', error);
      }
    }
  };
  const onChangeEmail = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };
  const onChangePassword = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const onChangeName = (text: string) => {
    setName(text);
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  const signIn = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.textContainer}>
          <Image
            source={images.frontImage}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.subFormContainer}>
          <CustomInput
            placeholder="Write Your Name please"
            value={name}
            onChangeText={onChangeName}
            placeholderTextColor={colors.lightGray}
            style={[styles.inputText]}
            label={strings.name}
            error={errors.name}
          />

          <CustomInput
            placeholder="Write Your Email please"
            placeholderTextColor={colors.lightGray}
            value={email}
            onChangeText={onChangeEmail}
            style={styles.inputText}
            label={strings.email}
            error={errors.email}
          />

          <CustomInput
            placeholderTextColor={colors.lightGray}
            placeholder="Write Your Password please"
            value={password}
            onChangeText={onChangePassword}
            style={styles.inputText}
            label={strings.password}
            error={errors.password}
          />
          <CustomButton label={strings.signUp} onPress={onLogin} />
          <Text style={styles.accountText}>
            {strings.haveAccount}
            <Text style={styles.color} onPress={signIn}>
              {' '}
              {strings.signHere}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorText: { fontSize: rf(12), color: colors.red, marginTop: rh(5) },
  headerImage: { width: rw(250), height: rh(300), alignSelf: 'center' },
  inputView: { marginVertical: rh(10) },
  inputLabel: { fontSize: rf(14), marginBottom: rh(5) },
  inputText: {
    borderRadius: rw(10),
    borderWidth: 1,
    borderColor: colors.blueGray,
    padding: rh(15),
  },
  signUpView: {
    backgroundColor: colors.blue,
    borderRadius: rw(20),
    marginTop: rh(15),
  },
  btnText: {
    fontSize: rf(16),
    color: colors.white,
    textAlign: 'center',
    paddingVertical: rh(15),
  },
  accountText: {
    fontSize: rf(16),
    textAlign: 'center',
    marginTop: rh(32),
    marginBottom: rh(30),
  },
  color: { color: colors.blue },
  textContainer: {
    paddingTop: rh(50),
    justifyContent: 'center',
  },

  subFormContainer: {
    paddingHorizontal: rw(20),
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default SignUp;
