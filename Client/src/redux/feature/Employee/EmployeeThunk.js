import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

const API_URL = "/api/employee";

// 🟢 1️⃣ CREATE EMPLOYEE - FIXED
export const createEmployee = createAsyncThunk(
  "employee/create",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(" Thunk: Sending employee data...", formData);
      
      const response = await axios.post(`${API_URL}/addEmployee`, formData);
      
      console.log("Thunk: Backend response:", response.data);
      return {
        data: response.data,
        message: "Employee created successfully ",
      };
    } catch (err) {
      console.error("❌ Thunk Error:", err);
      
      let errorMessage = err.message || "Unknown error occurred";
      
      if (err.response?.data) {
        errorMessage = err.response.data.message || 
                     err.response.data.error || 
                     JSON.stringify(err.response.data);
      }
      
      // ✅ IMPORTANT: return rejectWithValue
      return rejectWithValue(errorMessage);
    }
  }
);

// 🟡 2️⃣ UPDATE EMPLOYEE
export const updateEmployee = createAsyncThunk(
  "employee/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/updateEmployee`, formData);
      return {
        data: response.data,
        message: "Employee updated successfully ",
      };
    } catch (err) {
      let errorMessage = err.message;
      if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          JSON.stringify(err.response.data);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔵 3️⃣ GET EMPLOYEE BY ID
export const getEmployeeById = createAsyncThunk(
  "employee/getById",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getEmployeeById`, {
        params: { employeeId },
      });
      return {
        data: response.data,
        message: "Employee fetched successfully",
      };
    } catch (err) {
      let errorMessage = err.message;
      if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          JSON.stringify(err.response.data);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔴 4️⃣ DELETE EMPLOYEE
export const deleteEmployee = createAsyncThunk(
  "employee/delete",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteEmployee`, {
        params: { employeeId },
      });
      return {
        data: response.data,
        message: "Employee deleted successfully",
      };
    } catch (err) {
      let errorMessage = err.message;
      if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          JSON.stringify(err.response.data);
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// 🟣 5️⃣ GET ALL EMPLOYEES
export const getAllEmployees = createAsyncThunk(
  "employee/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getAllEmployees`);
      return {
        data: response.data,
        message: "All employees fetched successfully ",
      };
    } catch (err) {
      let errorMessage = err.message;
      if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.error ||
          JSON.stringify(err.response.data);
      }
      return rejectWithValue(errorMessage);
    }
  }
);