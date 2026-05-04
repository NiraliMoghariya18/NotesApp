import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './slice/authSlice';
import notesReducer from './slice/notesSlice';

const rootReducer = combineReducers({
  authSlice: authReducer,
  notesSlice: notesReducer,
});

const persistConfigData = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfigData, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useMyAppSelector = useSelector.withTypes<RootState>();
