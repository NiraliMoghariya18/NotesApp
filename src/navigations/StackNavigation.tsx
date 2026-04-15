import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { createNavigationContainerRef } from '@react-navigation/native';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import MainScreen from '../screens/MainScreen';
import NotesDetails from '../screens/NotesDetails';

const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef();

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={MainScreen} name="MainScreen" />
      <Stack.Screen component={SignUp} name="SignUp" />
      <Stack.Screen component={Login} name="Login" />
      <Stack.Screen component={NotesDetails} name="NotesDetails" />
    </Stack.Navigator>
  );
};

export default StackNavigation;
