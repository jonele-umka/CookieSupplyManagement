// src/slices/cookieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
        const responseDataError = await response.json();

        // Проверяем код ошибки
        if (
          response.status === 400 &&
          responseDataError.error.Message ===
            `ERROR: duplicate key value violates unique constraint "uni_cookies_name" (SQLSTATE 23505)`
        ) {
          return rejectWithValue("Это название уже существует");
        }

        const errorMessage =
          responseDataError.error.Message || "Произошла ошибка";

        return rejectWithValue(errorMessage);
      }

      const result = await response.json();
      return result;
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
        const responseDataError = await response.json();
        const errorMessage =
          responseDataError.error.Message || "Произошла ошибка";

        return rejectWithValue(errorMessage);
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
      });
  },
});

export const { setWeightId, clearWeightId } = cookieSlice.actions;
export default cookieSlice.reducer;
