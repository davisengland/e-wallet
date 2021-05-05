import worthReducer from "./reducers/worthReducer";
import expensesReducer from './reducers/expensesReducer'
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  worthReducer,
  expensesReducer
});

export default createStore(rootReducer, devToolsEnhancer());