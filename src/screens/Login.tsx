import React, { useCallback, useState } from 'react';
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
import { rw, rh, rf } from '../utils/responsive';
import { useAppDispatch } from '../redux/store';
import { images } from '../utils/image';
import { strings } from '../utils/strings';
import { createLoginUser } from '../redux/slice/authSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navgationTyeps';
import { LoginPayload } from '../types/notes.types';
import { colors } from '../utils/color';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';

interface FormError {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormError>({});

  const payload: LoginPayload = {
    email: email,
    password: password,
  };

  const validate = () => {
    const newErrors: FormError = {};

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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onLogin = async () => {
    if (!validate()) return;
    if (!email) {
      setErrors({ email: 'User not registered' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Incorrect password' });
      return;
    }
    try {
      // .unwrap() allows you to catch errors in the component
      await dispatch(createLoginUser(payload)).unwrap();
      navigation.navigate('NotesDetails');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Login User',
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
  const signUp = () => {
    navigation.navigate('SignUp');
  };

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
    }, []),
  );
  return (
    <KeyboardAvoidingView style={styles.container}>
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
            placeholder="Write Your Email please"
            value={email}
            onChangeText={onChangeEmail}
            placeholderTextColor={colors.lightGray}
            style={[styles.inputStyle]}
            label={strings.email}
            error={errors.email}
          />

          <CustomInput
            placeholder="Write Your Password please"
            value={password}
            onChangeText={onChangePassword}
            placeholderTextColor={colors.lightGray}
            style={[styles.inputStyle]}
            label={strings.password}
            error={errors.password}
          />
          <CustomButton label={strings.login} onPress={onLogin} />

          <Text style={styles.lastLineText}>
            {strings.DoNotAccount}
            <Text style={styles.subText} onPress={signUp}>
              {' '}
              {strings.signUpHere}
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
  headerImage: {
    width: rw(250),
    height: rh(300),
    alignSelf: 'center',
  },
  inputView: { marginVertical: rh(20) },
  inputLabel: { fontSize: rf(14), marginBottom: rh(5) },

  textContainer: {
    paddingTop: rh(50),
    justifyContent: 'center',
    paddingHorizontal: rw(28),
  },

  subFormContainer: {
    paddingHorizontal: rw(20),
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: rh(3),
  },

  inputStyle: {
    borderRadius: rw(10),
    borderWidth: 1,
    borderColor: colors.blueGray,
    padding: rh(15),
  },
  loginView: {
    backgroundColor: colors.blue,
    borderRadius: rw(20),
    marginTop: rh(15),
  },
  loginText: {
    fontSize: rf(16),
    color: colors.white,
    textAlign: 'center',
    paddingVertical: rh(15),
  },
  lastLineText: {
    fontSize: rf(16),
    textAlign: 'center',
    marginTop: rh(32),
    marginBottom: rh(30),
  },
  subText: { color: colors.blue },
});

export default Login;
