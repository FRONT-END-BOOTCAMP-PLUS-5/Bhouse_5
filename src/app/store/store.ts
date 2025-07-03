import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import infiniteScrollReducer from './slices/infiniteScrollSlice';
import loadingReducer from './slices/loadingSlice';
import settingReducer from './slices/settingsSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    infiniteScroll: infiniteScrollReducer,
    loading: loadingReducer,
    settings: settingReducer,
  },
});

// TypeScript helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for Redux
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: <T>(selector: (state: RootState) => T) => T =
  useSelector;

export default store;
