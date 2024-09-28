import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import cookieReducer from "./сookieSlice/cookieSlice";
import storeReducer from "./storeSlice/storeSlice";
import saleReducer from "./saleSlice/saleSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cookies: cookieReducer,
    store: storeReducer,
    sale: saleReducer,
  },
});

export default store;
