import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useNetInfo } from '@react-native-community/netinfo';

import {
  deleteNotes,
  deleteOfflineNote,
  fetchNotes,
  syncOfflineNotes,
} from '../redux/slice/notesSlice';
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
  const OfflineData = useMyAppSelector(state => state?.notesSlice.OfflineData);
  const data = useMyAppSelector(state => {
    const onlineData =
      state?.notesSlice?.fetchNotesData?.map(item => ({
        ...item,
        source: 'online',
      })) || [];

    const offlineData =
      state?.notesSlice?.OfflineData?.map(item => ({
        ...item,
        source: 'offline',
      })) || [];

    return [...onlineData, ...offlineData];
  });

  console.log('OfflineData :>> ', OfflineData);
  console.log('data :>> ', data);
  const loading = useMyAppSelector(state => state?.notesSlice.status);
  const [refreshing, setRefreshing] = useState(false);
  const { isConnected, isInternetReachable } = useNetInfo();
  const isSyncing = useRef(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchNotes());
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    if (isConnected && isInternetReachable && !isSyncing.current) {
      isSyncing.current = true;
      dispatch(syncOfflineNotes()).finally(() => (isSyncing.current = false));
    }
    dispatch(fetchNotes());
  }, [isConnected, isInternetReachable]);

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
        onPress: () => {
          data.map(i => {
            i.source === 'offline'
              ? dispatch(deleteOfflineNote(id))
              : dispatch(deleteNotes(id));
          });
        },
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
            Alert.alert('Logout User', 'Something went wrong!');
          }
        },
      },
    ]);
  };

  const onHandleNavigation = () => {
    navigation.navigate('AddNotes');
  };
  const flatListRenderItem = ({ item }: { item: Note }) => {
    console.log(item, 'item');
    return (
      <TouchableOpacity
        key={item?.id}
        style={styles.view}
        onPress={() => handleEdit(item)}
      >
        <View style={styles.imagesView}>
          {item.source === 'offline' && (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.blueGray,
                borderRadius: 10,
                paddingVertical: rh(5),
                paddingHorizontal: rw(12),
              }}
            >
              <Text>offline</Text>
            </View>
          )}
          <View style={{ width: 250 }}></View>
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
    );
  };

  const flatListExtraFunction = () => (
    <Text style={styles.noData}>No data found</Text>
  );

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
          ListEmptyComponent={flatListExtraFunction}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    // flex: 1,
  },
  deleteImage: {
    width: rw(22),
    height: rh(22),
  },
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
  noData: {
    textAlign: 'center',
    marginTop: rh(100),
    fontSize: rf(17),
    fontWeight: 500,
  },
});

export default NotesDetails;
