//import liraries
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StackNavigation from './src/navigations/StackNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/slice/store';

// create a component
const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

//make this component available to the app
export default App;
