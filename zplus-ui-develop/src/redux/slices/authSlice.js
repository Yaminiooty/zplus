import { createAction, createSlice } from '@reduxjs/toolkit';
import authThunks from '../thunks/authThunk';

export const resetLoginStates = createAction('login/reset');
export const resetForgotPasswordStates = createAction('forgotPassword/reset');
export const resetResetPasswordStates = createAction('resetPassword/reset');
export const resetRegisterStates = createAction('register/reset');
export const resetAccountVerificationStates = createAction('accountVerification/reset');
export const resetLogoutStates = createAction('logout/reset');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    isLoginLoading: false,
    isVerificationError: false,
    isEmailSent: false,
    isForgotPasswordLoading: false,
    isPasswordUpdated: false,
    isResetPasswordLoading: false,
    isUserRegistered: false,
    isUserRegisterLoading: false,
    isAccountVerified: false,
    isAccountVerifiedLoading: false,
    isLogout: false,
    userEmail: '',
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Handle login action
    builder
      .addCase(authThunks.login.pending, (state) => {
        state.isLoginLoading = true;
        state.isAuthenticated = false;
        state.isVerificationError = false;
      })
      .addCase(authThunks.login.fulfilled, (state) => {
        state.isLoginLoading = false;
        state.isAuthenticated = true;
        state.isVerificationError = false;
      })
      .addCase(authThunks.login.rejected, (state, action) => {
        if (action.payload === 202) {
          state.isVerificationError = true;
        }
        state.isLoginLoading = false;
        state.isAuthenticated = false;
      });

    //Handle forgot password action
    builder
      .addCase(authThunks.forgotPassword.pending, (state) => {
        state.isEmailSent = false;
        state.isForgotPasswordLoading = true;
      })
      .addCase(authThunks.forgotPassword.fulfilled, (state) => {
        state.isEmailSent = true;
        state.isForgotPasswordLoading = false;
      })
      .addCase(authThunks.forgotPassword.rejected, (state) => {
        state.isEmailSent = false;
        state.isForgotPasswordLoading = false;
      });

    //Handle reset password action
    builder
      .addCase(authThunks.resetPassword.pending, (state) => {
        state.isPasswordUpdated = false;
        state.isResetPasswordLoading = true;
      })
      .addCase(authThunks.resetPassword.fulfilled, (state) => {
        state.isPasswordUpdated = true;
        state.isResetPasswordLoading = false;
      })
      .addCase(authThunks.resetPassword.rejected, (state) => {
        state.isPasswordUpdated = false;
        state.isResetPasswordLoading = false;
      });

    //Handle register user action
    builder
      .addCase(authThunks.registerUser.pending, (state) => {
        state.isUserRegistered = false;
        state.isUserRegisterLoading = true;
      })
      .addCase(authThunks.registerUser.fulfilled, (state) => {
        state.isUserRegistered = true;
        state.isUserRegisterLoading = false;
      })
      .addCase(authThunks.registerUser.rejected, (state) => {
        state.isUserRegistered = false;
        state.isUserRegisterLoading = false;
      });

    //Handle verify account action
    builder
      .addCase(authThunks.verifyAccount.pending, (state) => {
        state.isAccountVerified = false;
        state.isAccountVerifiedLoading = true;
      })
      .addCase(authThunks.verifyAccount.fulfilled, (state) => {
        state.isAccountVerified = true;
        state.isAccountVerifiedLoading = false;
      })
      .addCase(authThunks.verifyAccount.rejected, (state) => {
        state.isAccountVerified = false;
        state.isAccountVerifiedLoading = false;
      });

    //Handle logout action
    builder
      .addCase(authThunks.logout.pending, (state) => {
        state.isLogout = false;
      })
      .addCase(authThunks.logout.fulfilled, (state) => {
        state.isLogout = true;
      })
      .addCase(authThunks.logout.rejected, (state) => {
        state.isLogout = false;
      });

    //Resetting login states
    builder.addCase(resetLoginStates, (state) => {
      state.isLoginLoading = false;
      state.isAuthenticated = false;
      state.isVerificationError = false;
    });

    //Resetting user register states
    builder.addCase(resetRegisterStates, (state) => {
      state.isUserLoading = false;
      state.isUserRegistered = false;
    });

    //Resetting account verification states
    builder.addCase(resetAccountVerificationStates, (state) => {
      state.isAccountVerifiedLoading = false;
      state.isAccountVerified = false;
    });

    //Resetting forgot password states
    builder.addCase(resetForgotPasswordStates, (state) => {
      state.isEmailSent = false;
      state.isForgotPasswordLoading = false;
    });

    //Resetting reset password states
    builder.addCase(resetResetPasswordStates, (state) => {
      state.isPasswordUpdated = false;
      state.isResetPasswordLoading = false;
    });

    //Resetting logout states
    builder.addCase(resetLogoutStates, (state) => {
      state.isLogout = false;
    });
  },
});

export const { setUserEmail } = authSlice.actions;

export default authSlice.reducer;
