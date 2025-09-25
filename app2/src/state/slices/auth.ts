import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

// Export State Key
export const STATE_KEY = "auth";

export interface AuthState {
  me: string;
  assume: boolean;
  isLoading: boolean;
  error: null;
}

/**
 * Default state object with initial values.
 */
// Initial State
export const initialState = {
  me: null,
  assume: false,
  isLoading: false,
  error: null,
} as const;

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
export const userSlice = createSlice({
  name: STATE_KEY,
  initialState,
  reducers: {
    setName: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.name>
    ) => {
      state.name = action.payload;
    },
    setEmail: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.email>
    ) => {
      state.email = action.payload;
    },
  },
});

// A small helper of user state for `useSelector` function.
export const getUserState = (state: { user: UserState }) => state.user;

// Exports all actions
export const { setName, setEmail } = userSlice.actions;

export default userSlice.reducer;
