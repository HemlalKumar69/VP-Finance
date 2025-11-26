import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios"; 

// ✅ Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });

      // Token ko localStorage me save karna (optional)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// ✅ Logout Thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return true;
});
