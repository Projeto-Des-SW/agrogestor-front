import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/es/storage";

const userSlice = createSlice({
  name: "user",
  initialState: { token: null, role: null } as {
    token: string | null;
    role: "ADMIN" | "USER" | null;
  },
  reducers: {
    login: (state, { payload: token }: PayloadAction<string>) => {
      state.token = token;
      state.role = jwtDecode<{ role: "ADMIN" | "USER" }>(token).role;
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const userActions = userSlice.actions;

const persistedReducer = persistReducer(
  { key: "root", storage },
  combineReducers({ user: userSlice.reducer }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export const persistor = persistStore(store);

export const useAppDispatch = useDispatch.withTypes<StoreDispatch>();
export const useAppSelector = useSelector.withTypes<StoreState>();

type StoreState = ReturnType<typeof store.getState>;
type StoreDispatch = typeof store.dispatch;
