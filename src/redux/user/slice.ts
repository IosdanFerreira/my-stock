import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface IUserProps {
  user: object | any;
  loading: boolean;
}

const initialState: IUserProps = {
  user: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Object>) => {

      state.user = action.payload;
      state.loading = false;

    },

    logout: (state) => {

      state.user = null;
      state.loading = false;
      
    }
  }
});

export const {
  login,
  logout,
} = userSlice.actions;

export default userSlice.reducer;