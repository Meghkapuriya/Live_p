import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: null,
  success: null,
  user: {},
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: {
    profileSuccess(state, action) {
      state.success = action.payload.status;
      state.user = action.payload.admin; // ✅ correct key
    },
    profileError(state, action) {
      state.error = action.payload;
    },
    resetProfileFlagChange(state) {
      state.success = null;
      state.error = null;
    },
  },
});

export const {
  profileSuccess,
  profileError,
  resetProfileFlagChange,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
