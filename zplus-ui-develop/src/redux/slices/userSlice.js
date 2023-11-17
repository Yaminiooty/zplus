import { createAction, createSlice } from '@reduxjs/toolkit';
import userThunk from '../thunks/userThunk';

export const resetFetchStates = createAction('getUser/reset');
export const resetUpdateStates = createAction('updateUser/reset');
export const resetPasswordStates = createAction('updatePassword/reset');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isFetchingDetails: false,
    isDetailsFetched: false,
    userDetails: null,
    isUpdatingDetails: false,
    isDetailsUpdated: false,
    isUpdatingPassword: false,
    isPasswordUpdated: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(userThunk.getUserDetails.pending, (state) => {
        state.isFetchingDetails = true;
        state.isDetailsFetched = false;
      })
      .addCase(userThunk.getUserDetails.fulfilled, (state, action) => {
        state.isFetchingDetails = false;
        state.isDetailsFetched = true;
        state.userDetails = action.payload;
      })
      .addCase(userThunk.getUserDetails.rejected, (state) => {
        state.isFetchingDetails = false;
        state.isDetailsFetched = false;
      });

    builder
      .addCase(userThunk.updateUserDetails.pending, (state) => {
        state.isUpdatingDetails = true;
        state.isDetailsUpdated = false;
      })
      .addCase(userThunk.updateUserDetails.fulfilled, (state) => {
        state.isUpdatingDetails = false;
        state.isDetailsUpdated = true;
      })
      .addCase(userThunk.updateUserDetails.rejected, (state) => {
        state.isUpdatingDetails = false;
        state.isDetailsUpdated = false;
      });

    builder
      .addCase(userThunk.changePassword.pending, (state) => {
        state.isUpdatingPassword = true;
        state.isPasswordUpdated = false;
      })
      .addCase(userThunk.changePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
        state.isPasswordUpdated = true;
      })
      .addCase(userThunk.changePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
        state.isPasswordUpdated = false;
      });

    builder.addCase(resetFetchStates, (state) => {
      state.isFetchingDetails = false;
      state.isDetailsFetched = false;
      state.userDetails = null;
    });

    builder.addCase(resetUpdateStates, (state) => {
      state.isUpdatingDetails = false;
      state.isDetailsUpdated = false;
    });

    builder.addCase(resetPasswordStates, (state) => {
      state.isUpdatingPassword = false;
      state.isPasswordUpdated = false;
    });
  },
});

export default userSlice.reducer;
