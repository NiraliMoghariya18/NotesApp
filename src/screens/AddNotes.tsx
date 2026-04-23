import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { rf, rh, rw } from '../utils/responsive';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useMyAppSelector } from '../redux/store';
import { images } from '../utils/image';
import {
  addOfflineNote,
  createNotes,
  updateOfflineNote,
  updateNotes,
} from '../redux/slice/notesSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navgationTyeps';
import { strings } from '../utils/strings';
import { CreateNotesPayload, Note } from '../types/notes.types';
import axios from 'axios';
import { colors } from '../utils/color';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import NetInfo from '@react-native-community/netinfo';

interface Error {
  title?: string;
  description?: string;
}

const AddNotes = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [errors, setErrors] = useState<Error>({});
  const dispatch = useAppDispatch();
  const route = useRoute();
  const params = route.params as { isEdit: boolean; item: Note } | undefined;
  const editItem = params?.item;
  const isEdit = params?.isEdit && editItem?.id;
  const id = editItem?.id;
  const [title, setTitle] = useState(editItem?.title || '');
  const [description, setDescription] = useState(editItem?.description || '');

  const notesSlice = useMyAppSelector(state => [
    ...state.notesSlice.offlineData,
    ...state.notesSlice.fetchNotesData,
  ]);
  console.log(notesSlice, 'notesSlice');
  const createNotesPayload: CreateNotesPayload = {
    id: Date.now().toString(),
    description: description,
    title: title,
  };

  const validate = () => {
    const newErrors: Error = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    const network = await NetInfo.fetch();

    if (!network.isConnected) {
      if (isEdit) {
        if (!id) {
          console.error('No ID found for editing');
          return;
        }
        await dispatch(updateOfflineNote({ id, data: createNotesPayload }));
      } else {
        await dispatch(addOfflineNote(createNotesPayload));
      }
      navigation.goBack();
      return;
    }

    try {
      if (isEdit && editItem.isOffline === true) {
        if (!id) {
          console.error('No ID found for editing');
          return;
        }
        await dispatch(updateOfflineNote({ id, data: createNotesPayload }));
      } else if (isEdit) {
        if (!id) {
          console.error('No ID found for editing');
          return;
        }
        await dispatch(updateNotes({ id, data: createNotesPayload })).unwrap();
      } else {
        await dispatch(createNotes(createNotesPayload)).unwrap();
      }
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Add Note',
          error?.response?.data?.message || 'Something went wrong!',
        );
      } else {
        console.error('Non-Axios error:', error);
      }
    }
  };

  const handleChangeTitle = (text: string) => {
    setTitle(text);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleChangeDescription = (text: string) => {
    setDescription(text);
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Image
            source={images.back}
            style={styles.back}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.title}>{strings.createNotes}</Text>
      </View>

      <CustomInput
        placeholder="enter your title"
        placeholderTextColor={colors.lightGray}
        value={title}
        style={[styles.inputStyle]}
        onChangeText={handleChangeTitle}
        multiline={true}
        numberOfLines={2}
        error={errors.title}
      />
      <CustomInput
        value={description}
        placeholder="enter your description"
        placeholderTextColor={colors.lightGray}
        style={styles.inputStyle}
        onChangeText={handleChangeDescription}
        multiline={true}
        numberOfLines={5}
        error={errors.description}
      />

      <CustomButton
        label={strings.submit}
        onPress={onSave}
        style={styles.submitView}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: rw(30),
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rh(20),
  },
  title: {
    fontSize: rf(20),
    fontWeight: 600,
    textAlign: 'center',
    flex: 1,
    marginRight: rw(20),
  },
  back: { width: rw(20), height: rh(20) },

  inputStyle: {
    borderWidth: 2,
    borderColor: colors.mediumDarkGray,
    paddingVertical: rh(14),
    paddingHorizontal: rw(15),
    borderRadius: rw(14),
  },
  submitView: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingHorizontal: rw(15),
    marginTop: rh(10),
    alignSelf: 'center',
  },
  submitText: { fontSize: rf(17), color: colors.white, fontWeight: 'bold' },
});

export default AddNotes;
