// src/slices/storeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const postStore = createAsyncThunk(
  "store/postStore",
  async ({ token, storeData }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://91.218.140.135:8080/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      return await result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStore = createAsyncThunk(
  "store/fetchStore",
  async ({ token, page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://91.218.140.135:8080/api/store?page_size=${pageSize}&page=${page}`,
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

const storeSlice = createSlice({
  name: "store",
  initialState: {
    store: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.store = {
          data: action.payload.data,
          total: action.payload.total,
        };
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(postStore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postStore.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Проверяем, что store является массивом
        if (Array.isArray(state.store)) {
          state.store.push(action.payload);
        } else {
          state.store = [action.payload];
        }
      })
      .addCase(postStore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;
