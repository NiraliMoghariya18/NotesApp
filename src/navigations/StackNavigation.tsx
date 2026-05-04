import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import NotesDetails from '../screens/NotesDetails';
import AddNotes from '../screens/AddNotes';
import { RootState, useMyAppSelector } from '../redux/store';
import { RootStackParamList } from '../types/navgationTyeps';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const isLoggedIn = useMyAppSelector(
    (state: RootState) => state.authSlice.isLoggedIn,
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen component={Login} name="Login" />
          <Stack.Screen component={SignUp} name="SignUp" />
        </>
      ) : (
        <>
          <Stack.Screen component={NotesDetails} name="NotesDetails" />
          <Stack.Screen component={AddNotes} name="AddNotes" />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
