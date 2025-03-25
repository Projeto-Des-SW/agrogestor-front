import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/es/storage";

const userSlice = createSlice({
  name: "user",
  initialState: { token: null } as { token: string | null },
  reducers: {
    login: (state, { payload: token }: PayloadAction<string>) => {
      state.token = token;
    },

    logout: (state) => {
      state.token = null;
    },
  },
});

export const userActions = userSlice.actions;

export const store = configureStore({
  reducer: persistReducer(
    { key: "root", storage },
    combineReducers({ user: userSlice.reducer }),
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST"] },
    }),
});
export const persistor = persistStore(store);

export const useDispatch = useReduxDispatch.withTypes<StoreDispatch>();
export const useSelector = useReduxSelector.withTypes<StoreState>();

type StoreState = ReturnType<typeof store.getState>;
type StoreDispatch = typeof store.dispatch;
