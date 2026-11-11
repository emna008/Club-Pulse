import { createSlice } from '@reduxjs/toolkit';

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setArticles: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addArticle: (state, action) => {
      state.items.unshift(action.payload);
    },
    removeArticle: (state, action) => {
      state.items = state.items.filter((article) => article._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setArticles, addArticle, removeArticle, setLoading, setError } =
  articleSlice.actions;

export default articleSlice.reducer;
