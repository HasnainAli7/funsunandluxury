import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface RegisterState {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        Description: string;
        Profile: File | null;
        Profile_ImagePath: string;
        Registration_Type: number;
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
        Description: '',
        Profile: null,
        Profile_ImagePath: '',
        Registration_Type: 0,
    },
    status: 'idle',
    error: null,
};

export const registerUser = createAsyncThunk(
    'register/registerUser',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const result = await response.json();
                return rejectWithValue(result.message || 'An error occurred');
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
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = initialState.data; // Reset data on success
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default registerSlice.reducer;
