import netWorthReducer from "./reducers/netWorthReducer";
import expensesReducer from './reducers/expensesReducer'
import incomeReducer from './reducers/incomeReducer'
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  netWorthReducer,
  expensesReducer,
  incomeReducer
});

export default createStore(rootReducer, devToolsEnhancer());