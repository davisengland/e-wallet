import netWorthReducer from "./reducers/netWorthReducer";
import expensesReducer from './reducers/expensesReducer'
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  netWorthReducer,
  expensesReducer
});

export default createStore(rootReducer, devToolsEnhancer());