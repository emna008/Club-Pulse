import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './articleSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    articles: articleReducer,
    auth: authReducer
  }
});
