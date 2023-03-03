import { createSlice, configureStore } from '@reduxjs/toolkit';
import profileReducers from './profileReducer';

const isDOM =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement;

const data = isDOM && JSON.parse(localStorage.getItem('user'));
let initialState;
if (data) {
  initialState = {
    userId: data.id,
    name: data.name,
    profileImageUrl: data.url,
    role: data.role,
    unreadNotifications: data.unread_notifications,
  };
} else {
  initialState = {
    userId: null,
    name: null,
    profileImageUrl: null,
    role: null,
    unreadNotifications: null,
  };
}

const profileSlice = createSlice({
  name: 'ProfileState',
  initialState: initialState,
  reducers: profileReducers,
});

const store = configureStore({
  reducer: {
    profileSlice: profileSlice.reducer,
  },
});

export default store;
export const profileActions = profileSlice.actions;
