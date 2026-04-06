import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User type
type User = {
  email: string;
  password: string;
};

// Auth state type
type AuthState = {
  users: User[];            // All registered users
  currentUser: User | null; // Logged-in user
  isAuthenticated: boolean; // Login state
  loginError: string | null; // Login errors (wrong password / not found)
  signupError: string | null; // Signup errors (duplicate email)
};

// Initial state
const initialState: AuthState = {
  users: [],
  currentUser: null,
  isAuthenticated: false,
  loginError: null,
  signupError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ------------------ SIGNUP ------------------
    signup: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const existingUser = state.users.find((u) => u.email === action.payload.email);

      if (existingUser) {
        state.signupError = "User already exists with this email."; // ❌ duplicate email error
        return;
      }

      state.users.push(action.payload); // ✅ add new user
      state.signupError = null;          // clear any previous error
      state.currentUser = action.payload; // auto-login after signup
      state.isAuthenticated = true;
    },

    // ------------------ LOGIN ------------------
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const user = state.users.find((u) => u.email === action.payload.email);

      if (!user) {
        state.loginError = "User not found. Please Sign up first."; // ❌ user not found
        state.currentUser = null;
        state.isAuthenticated = false;
        return;
      }

      if (user.password !== action.payload.password) {
        state.loginError = "Incorrect Password."; // ❌ wrong password
        state.currentUser = null;
        state.isAuthenticated = false;
        return;
      }

      // ✅ successful login
      state.currentUser = user;
      state.isAuthenticated = true;
      state.loginError = null;
    },

    // ------------------ LOGOUT ------------------
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.signupError = null;
    },

    // Clear signup/login errors
    clearErrors: (state) => {
      state.loginError = null;
      state.signupError = null;
    },
  },
});

export const { signup, login, logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
