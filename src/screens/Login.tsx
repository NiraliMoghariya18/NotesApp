import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { rw, rh, rf } from '../utils/responsive';

import colors from '../utils/color';
import { useAppDispatch } from '../redux/slice/store';
import { fetchLoginUser } from '../redux/slice/login';
import { images } from '../utils/image';

interface FormError {
  email?: string;
  password?: string;
}

export interface LoginPayload {
  id?: string;
  email: string;
  password: string;
  token?: string;
}
const Login = ({ navigation }: any) => {
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

  const onLogin = () => {
    if (!validate()) return;

    // const foundUser = users.find((u: User) => u.email === email);

    if (!email) {
      setErrors({ email: 'User not registered' });
      return;
    }

    if (!password) {
      setErrors({ password: 'Incorrect password' });
      return;
    }

    dispatch(fetchLoginUser(payload));

    navigation.navigate('NotesDetails');
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
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={styles.textContainer}>
          <TouchableOpacity
            style={{
              padding: rw(15),
              backgroundColor: '#F4F7FF',
              width: rw(40),
              height: rh(36),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: rw(50),
            }}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Image
              source={images.back}
              style={{
                tintColor: 'black',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Signup</Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: rh(17),
              backgroundColor: '#F4F7FF',
              borderRadius: rw(10),
              alignItems: 'center',
              justifyContent: 'center',
              gap: rw(8),
            }}
          >
            <Image source={images.google} />
            <Text style={{ fontSize: rf(16) }}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: rw(28),
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: rh(32),
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: '#CBD2E0',
              flex: 1,
              height: 1,
            }}
          />
          <Text style={{ flex: 1, textAlign: 'center', fontSize: rf(14) }}>
            or sign up with
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#CBD2E0',
              flex: 1,
              height: 1,
            }}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.subFormContainer}>
            <View style={{ marginVertical: rh(20) }}>
              <Text style={{ fontSize: rf(14), marginBottom: rh(5) }}>
                Email
              </Text>
              <TextInput
                placeholder="Write Your Email please"
                value={email}
                onChangeText={onChangeEmail}
                placeholderTextColor="#BABABA"
                style={{
                  borderRadius: rw(10),
                  borderWidth: 1,
                  borderColor: '#CBD2E0',
                  padding: rh(15),
                }}
                //   error={errors.Name}
              />
              {errors?.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            <View style={{ marginVertical: rh(20) }}>
              <Text style={{ fontSize: rf(14), marginBottom: rh(5) }}>
                Password
              </Text>
              <TextInput
                placeholder="Write Your Password please"
                value={password}
                onChangeText={onChangePassword}
                placeholderTextColor="#BABABA"
                style={{
                  borderRadius: rw(10),
                  borderWidth: 1,
                  borderColor: '#CBD2E0',
                  padding: rh(15),
                }}
                //   error={errors.Name}
              />
              {errors?.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#1443C3',
                borderRadius: rw(20),
                marginTop: rh(25),
              }}
              onPress={onLogin}
            >
              <Text
                style={{
                  fontSize: rf(16),
                  color: 'white',
                  textAlign: 'center',
                  paddingVertical: rh(15),
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: rf(16),
                textAlign: 'center',
                marginTop: rh(32),
              }}
            >
              Don’t have an Account?
              <Text
                style={{ color: '#1443C3' }}
                onPress={() => navigation.navigate('SignUp')}
              >
                {' '}
                Sign up here{' '}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorText: { fontSize: rf(12), color: '#e00b0b' },

  textContainer: {
    paddingTop: rh(50),
    paddingBottom: rh(50),
    justifyContent: 'center',
    paddingHorizontal: rw(28),
  },
  title: {
    fontSize: rf(25),
    fontWeight: 'bold',
    marginBottom: rh(1),
    textAlign: 'left',
    color: colors.white,
  },
  subTitle: {
    fontSize: rf(15),
    fontWeight: 'bold',
    textAlign: 'left',
    color: colors.white,
  },
  formContainer: {
    backgroundColor: colors.white,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: rh(5),
    paddingHorizontal: rw(20),
    minHeight: '100%',
    marginTop: rh(3),
  },
  subFormContainer: {
    paddingHorizontal: rw(5),
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: rh(3),
  },
  button: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: rh(2.5),
    paddingVertical: rh(2),
    borderRadius: 50,
  },
});

export default Login;
