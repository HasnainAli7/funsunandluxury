import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '@/store/slices/registerSlice';
import venueReducer from '@/store/slices/venueSlice';
import poolReducer from '@/store/slices/poolSlice';
import authReducer from '@/store/slices/authSlice';
import {jwtDecode} from 'jwt-decode';
import { parse } from 'cookie';
import { JwtPayload, User } from '@/routers/types';

const loadState = () => {
  if (typeof window === 'undefined') return undefined;  // Check if on the server-side

  try {
    const cookies = parse(document.cookie);
    const token = cookies.token;

    if (token) {
      const user = jwtDecode<JwtPayload>(token);
      return {
        auth: {
          isAuthenticated: true,
          user: user as User,  // Type assertion to User
        },
      };
    }
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
  return undefined;
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    register: registerReducer,
    venue: venueReducer,
    pool: poolReducer,
    auth: authReducer,
  },
  preloadedState: persistedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
