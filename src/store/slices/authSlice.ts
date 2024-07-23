import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, JwtPayload } from '@/routers/types';
import {jwtDecode} from 'jwt-decode';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      const decodedToken = jwtDecode<JwtPayload>(action.payload);
      state.isAuthenticated = true;
      state.user = decodedToken;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
