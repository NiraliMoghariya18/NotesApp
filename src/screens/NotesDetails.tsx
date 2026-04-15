//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  AppDispatch,
  RootState,
  useAppDispatch,
  useMyAppSelector,
} from '../redux/slice/store';
import { useSelector } from 'react-redux';
import { fetchNotes } from '../redux/slice/noteDetails';

const NotesDetails = () => {
  const dispatch = useAppDispatch();
  const { data } = useMyAppSelector(
    (state: RootState) => state?.noteDetailsSlice,
  );
  console.log(data, 'data');

  useEffect(() => {
    dispatch(fetchNotes());
  }, []);

  return (
    <View style={styles.container}>
      <Text>MyComponent</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default NotesDetails;
