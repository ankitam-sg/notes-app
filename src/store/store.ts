import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import notesReducer from "../features/notes/notesSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from 'redux-persist';

const fixedStorage = (storage as unknown as { default?: typeof storage }).default || storage;

const rootReducer = combineReducers({
    auth: authReducer,
    notes: notesReducer,
});

const persistConfig = {
    key: "root",
    storage: fixedStorage, // Use the default storage (localStorage)
    whitelist: ["auth", "notes"], // Only persist auth and notes slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store); 

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;