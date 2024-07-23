import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {VenueSpace} from '@/routers/types'

// Define the initial state
interface VenueState {
  venues: VenueSpace[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VenueState = {
  venues: [],
  status: 'idle',
  error: null,
};

export const submitVenue = createAsyncThunk(
  'venue/Addvenue',
  async (venueData: VenueSpace, { rejectWithValue,getState }) => {
    try {
     
      const formdata = new FormData();

      // Append all fields from venueData to FormData
      Object.entries(venueData).forEach(([key, value]) => {
        if (key === 'venueimage' && Array.isArray(value)) {
         
          value.forEach((file) => {
            formdata.append('venueimage', file);
          });
        
        } 
        
        else if (key === 'Venue_cover_image' && value instanceof File) {
          // Append single file (if Venue_cover_image is a single file)
          formdata.append('Venue_cover_image', value);
        } 
        else {
          // Append other form fields
          formdata.append(key, String(value));
        }
      });

      const response = await fetch('/api/venue', {
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
const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitVenue.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitVenue.fulfilled, (state, action) => {
        state.venues.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(submitVenue.rejected, (state,action) => {
        state.status = 'failed';
        state.error = action.error as string;
      });
  },
});

export default venueSlice.reducer;
