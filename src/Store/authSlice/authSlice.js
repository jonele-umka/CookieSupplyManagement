import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_URL = process.env.API_URL;

// Асинхронные действия (thunks)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://91.218.140.135:8080/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const responseDataError = await response.json();
        const errorMessage =
          responseDataError.error.Message || "Произошла ошибка";

        return rejectWithValue(errorMessage);
      }

      const data = await response.json();
      const token = data?.token;
      const username = userData.username;
      const password = userData.password;

      await localStorage.setItem("token", token);
      await localStorage.setItem("username", username);
      await localStorage.setItem("password", password);

      return { token, username };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = await localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseDataError = await response.json();
        const errorMessage =
          responseDataError.error.Message || "Произошла ошибка";
        return rejectWithValue(errorMessage);
      }

      await localStorage.removeItem("token");
      await localStorage.removeItem("username");
      await localStorage.removeItem("password");
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Слайс
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    token: null,
    username: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
       
        state.token = action.payload.token;
        state.userProfile = action.payload.username;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('fefe',action.payload)
        state.loading = false;
        state.error = action.payload;
        toast.error(`Ошибка авторизации: ${action.payload}`);   
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        toast.success("Вы успешно вышли из системы");  
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Ошибка выхода: ${action.payload}`);   
      });
  },
});

export default authSlice.reducer;
