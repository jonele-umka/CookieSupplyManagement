import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const postSale = createAsyncThunk(
  "sale/postSale",
  async ({ token, saleData }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://91.218.140.135:8080/api/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saleData),
      });

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

export const fetchSale = createAsyncThunk(
  "sale/fetchSale",
  async ({ token, page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://91.218.140.135:8080/api/sale?page_size=${pageSize}&page=${page}`,
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

const saleSlice = createSlice({
  name: "sale",
  initialState: {
    sale: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sale = {
          data: action.payload.data,
          total: action.payload.total,
        };
      })
      .addCase(fetchSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(postSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(state.sale)) {
          state.sale.push(action.payload);
        } else {
          state.sale = [action.payload];
        }
      })
      .addCase(postSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default saleSlice.reducer;
