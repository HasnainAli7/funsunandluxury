import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface RegisterState {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RegisterState = {
    data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    },
    status: 'idle',
    error: null,
};

export const registerUser = createAsyncThunk(
    'register/registerUser',
    async (userData: Omit<RegisterState['data'], 'confirmPassword'>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            debugger
            if (!response.ok) {
                debugger
                const result = await response.json();
                return rejectWithValue(result.error);
            }

            return response.json();
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = { ...state.data, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error as string;
            });
    },
});

export const { setData } = registerSlice.actions;

export default registerSlice.reducer;
