import netWorthReducer from "./reducers/netWorthReducer";
import expensesReducer from './reducers/expensesReducer'
import incomeReducer from './reducers/incomeReducer'
import budgetReducer from './reducers/budgetReducer'
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  netWorthReducer,
  expensesReducer,
  incomeReducer,
  budgetReducer
});

export default createStore(rootReducer, devToolsEnhancer());