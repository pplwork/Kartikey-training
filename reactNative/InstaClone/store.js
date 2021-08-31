import { createStore } from "redux";
import rootreducer from "./reducers/rootreducer";
import AsyncStorage from "@react-native-community/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "persistedReducer",
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootreducer);
const store = createStore(persistedReducer);
let persistedStore = persistStore(store);

export { store, persistedStore };
