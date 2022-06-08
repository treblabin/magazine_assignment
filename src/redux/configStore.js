import {
  legacy_createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import post from "./modules/post";
import thunk from "redux-thunk";

const middlewares = [thunk];
const rootReducer = combineReducers({ post });
const enhancer = applyMiddleware(...middlewares);

const store = legacy_createStore(rootReducer, enhancer);

export default store;
