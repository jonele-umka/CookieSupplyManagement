// src/slices/cookieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const postWeight = createAsyncThunk(
  "cookies/postWeight",
  async ({ weight, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://91.218.140.135:8080/api/cookie_type",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ weight }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("ID", result);
      return await result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронный thunk для отправки данных о новой партии
export const postCookie = createAsyncThunk(
  "cookies/postCookie",
  async ({ token, cookieData }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://91.218.140.135:8080/api/cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cookieData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("data", result);
      return await result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCookies = createAsyncThunk(
  "cookies/fetchCookies",
  async ({ token, page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://91.218.140.135:8080/api/cookie?page_size=${pageSize}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cookieSlice = createSlice({
  name: "cookies",
  initialState: {
    weightId: null,
    cookies: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setWeightId(state, action) {
      state.weightId = action.payload;
    },
    clearWeightId(state) {
      state.weightId = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCookies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCookies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cookies = {
          data: action.payload.data,
          total: action.payload.total,
        };
      })
      .addCase(fetchCookies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Обработка запроса на добавление нового печенья
      .addCase(postCookie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postCookie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cookies.data.push(action.payload);
      })
      .addCase(postCookie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Обработка запроса на создание нового типа печенья по весу
      .addCase(postWeight.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postWeight.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.weightId = action.payload.id; // Сохраняем ID нового типа печенья
      })
      .addCase(postWeight.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setWeightId, clearWeightId } = cookieSlice.actions;
export default cookieSlice.reducer;
