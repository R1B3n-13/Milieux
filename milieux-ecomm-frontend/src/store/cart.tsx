import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { actions, reducer } = cartSlice;

export default reducer;
