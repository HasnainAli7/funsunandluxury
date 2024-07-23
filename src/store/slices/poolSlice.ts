import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {PoolListing} from '@/routers/types'

interface PoolState {
  pools: PoolListing[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PoolState = {
  pools: [],
  status: 'idle',
  error: null,
};

export const submitPool = createAsyncThunk(
  'pool/AddPool',
  async (poolData: PoolListing, { rejectWithValue }) => {
    try {
     
      const formdata = new FormData();

      
      Object.entries(poolData).forEach(([key, value]) => {
        if (key === 'pool_images' && Array.isArray(value)) {
         
          value.forEach((file) => {
            formdata.append('pool_images', file);
          });
        
        } 
        
        else if (key === 'pool_cover_image' && value instanceof File) {
          formdata.append('pool_cover_image', value);
        }

        else {
          formdata.append(key, String(value));
        }
      });
      
      const response = await fetch('/api/pool', {
        method: 'POST',
        body: formdata,
      });

      if (!response.ok) {
        const result = await response.json();
        return rejectWithValue(result.error);
      }

      return response.json();
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);
// Create the slice
const  poolSlice = createSlice({
  name: 'pool',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitPool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitPool.fulfilled, (state, action) => {
        state.pools.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(submitPool.rejected, (state,action) => {
        state.status = 'failed';
        state.error = action.error as string;
      });
  },
});

export default poolSlice.reducer;
