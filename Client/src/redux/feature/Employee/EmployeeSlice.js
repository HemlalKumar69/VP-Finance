import { createSlice } from "@reduxjs/toolkit";
import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
  getAllEmployees,
} from "./EmployeeThunk";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    employee: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // ✅ Clear errors and messages
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetEmployeeState: (state) => {
      state.employees = [];
      state.employee = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ CREATE EMPLOYEE - UPDATED
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // ✅ FIX: Properly handle the response structure
        if (action.payload.data && action.payload.data.data) {
          state.employees.push(action.payload.data.data);
        }
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟡 UPDATE EMPLOYEE - UPDATED
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // ✅ Update the employee in the list if needed
        if (action.payload.data && action.payload.data.data) {
          const updatedEmployee = action.payload.data.data;
          const index = state.employees.findIndex(emp => emp._id === updatedEmployee._id);
          if (index !== -1) {
            state.employees[index] = updatedEmployee;
          }
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 GET EMPLOYEE BY ID - UPDATED
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ FIX: Properly handle the response structure
        if (action.payload.data && action.payload.data.data) {
          state.employee = action.payload.data.data;
        }
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔴 DELETE EMPLOYEE - UPDATED
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // ✅ Remove employee from the list
        if (action.payload.data && action.payload.data.data) {
          const deletedEmployeeId = action.payload.data.data._id;
          state.employees = state.employees.filter(emp => emp._id !== deletedEmployeeId);
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟣 GET ALL EMPLOYEES - UPDATED
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ FIX: Properly handle the response structure
        if (action.payload.data && action.payload.data.data) {
          state.employees = action.payload.data.data;
        }
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;