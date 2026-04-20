import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useMyAppSelector } from '../redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rf, rh, rw } from '../utils/responsive';
import { images } from '../utils/image';
import { deleteNotes, fetchNotes } from '../redux/slice/notesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { logout } from '../redux/slice/authSlice';
import { strings } from '../utils/strings';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { items, RootStackParamList } from '../types/navgationTyeps';
import moment from 'moment';
import { colors } from '../utils/color';
import { Note } from '../types/notes.types';

const NotesDetails = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const data = useMyAppSelector(state => state?.notesSlice.fetchNotesData);
  const loading = useMyAppSelector(state => state?.notesSlice.status);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    dispatch(fetchNotes());
  }, []);

  const handleEdit = (item: items) => {
    navigation.navigate('AddNotes', {
      item,
      isEdit: true,
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNotes(id)),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Logout cancelled'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await Keychain.resetGenericPassword();
            await AsyncStorage.clear();
            dispatch(logout());
          } catch (error) {
            Alert.alert(
              'Server Error',
              'Failed to logout user. Please try again.',
            );
          }
        },
      },
    ]);
  };

  const onHandleNavigation = () => {
    navigation.navigate('AddNotes');
  };
  const flatListRenderItem = ({ item }: { item: Note }) => {
    return (
      <>
        <TouchableOpacity
          key={item?.id}
          style={styles.view}
          onPress={() => handleEdit(item)}
        >
          <View style={styles.imagesView}>
            <TouchableOpacity onPress={() => handleDelete(item?.id)}>
              <Image
                source={images.bin}
                style={styles.deleteImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.fs19} numberOfLines={2} ellipsizeMode="tail">
            {strings.title}: {item?.title}
          </Text>
          <Text style={styles.fs15} numberOfLines={5}>
            <Text style={styles.textColor} ellipsizeMode="tail">
              {strings.description}:{' '}
            </Text>
            {item?.description}
          </Text>

          <Text style={styles.dateText}>
            {moment(item.updatedAt).format('DD-MM-YYYY hh:mm A')}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={images.logout}
            resizeMode="contain"
            style={styles.logout}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.notesList}</Text>
      </View>
      {loading === 'loading' ? (
        <View style={styles.indicatorStyle}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item?.id?.toString()}
          renderItem={flatListRenderItem}
          ListEmptyComponent={() => (
            <Text
              style={{
                textAlign: 'center',
                marginTop: rh(100),
                fontSize: rf(17),
              }}
            >
              No data found
            </Text>
          )}
          contentContainerStyle={styles.gap}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        onPress={onHandleNavigation}
        style={styles.addImageView}
      >
        <Image
          source={images.add}
          style={styles.addImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: rw(20),
  },
  gap: { gap: rh(20) },
  view: {
    backgroundColor: colors.white,
    paddingVertical: rh(10),
    paddingHorizontal: rw(15),
    borderRadius: 10,
  },
  imagesView: {
    flexDirection: 'row',
    gap: rw(5),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteImage: { width: rw(20), height: rh(20) },
  fs19: { fontSize: rf(19), marginBottom: rh(5) },
  fs15: { fontSize: rf(15), color: colors.lightGray },
  textColor: { color: colors.darkGray },
  addImage: { width: rw(40), height: rh(40) },
  addImageView: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'flex-end',
    right: 10,
  },

  title: {
    fontSize: rf(20),
    fontWeight: 600,
    textAlign: 'center',
    flex: 1,
    marginRight: rw(30),
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rh(30),
  },
  logout: {
    width: rw(30),
    height: rh(30),
  },
  dateText: {
    fontSize: rf(10),
    color: colors.lightGray,
    textAlign: 'right',
  },
  indicatorStyle: { flex: 1, justifyContent: 'center' },
});

export default NotesDetails;
