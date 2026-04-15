import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { rf, rh, rw } from '../utils/responsive';
import colors from '../utils/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { images } from '../utils/image';

const MainScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const onRegister = () => {
    navigation.navigate('SignUp');
  };

  const onLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.todoList}> */}
      <Image source={images.note} style={styles.todoImage} />
      {/* </View> */}
      <View style={{ marginTop: rh(5) }}>
        <Text style={styles.header}>WelCome</Text>
        <Text style={styles.text}>Create Your Notes</Text>
      </View>
      <View style={{ marginTop: rh(5) }}>
        <Button title="Registration" onPress={() => onRegister()} />
      </View>
      <View>
        <Text style={styles.text2}>
          Already have an account?{' '}
          <Text style={styles.login} onPress={() => onLogin()}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.white,
    fontSize: rf(15),
  },
  text2: { color: colors.white, fontSize: rf(14) },
  login: {
    color: colors.drawerHighlight,
    fontSize: rf(14),
    fontWeight: 'bold',
  },
  todoList: {
    width: rw(150),
    height: rw(150),
    borderRadius: rw(150) / 2,
    backgroundColor: colors.goldenBeige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoImage: {
    // position: 'absolute',
    width: rw(70),
    height: rh(70),
    // left: rw(22),
    resizeMode: 'contain',
  },
  header: {
    fontSize: rf(30),
    color: colors.white,
    fontWeight: '700',
    marginBottom: rh(1),
  },
  button: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: rh(2.5),
    paddingVertical: rh(2),
    borderRadius: 50,
  },
});

export default MainScreen;
