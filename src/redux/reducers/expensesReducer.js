const initialState = {
    expenses: [],
  };
  
  const GET_EXPENSES = "GET_EXPENSES";
  const GET_EXPENSE = "GET_EXPENSE";
  const ADD_EXPENSE = "ADD_EXPENSE";
  
  export function getExpenses(payload) {
    return {
      type: GET_EXPENSES,
      payload: payload,
    };
  }
  
  export function getExpense(payload) {
    return {
      type: GET_EXPENSE,
      payload: payload,
    };
  }
  
  export function addExpense(payload) {
    return {
      type: ADD_EXPENSE,
      payload: payload,
    };
  }
  
  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_EXPENSES:
        return {
          ...state,
          expenses: action.payload,
        };
      case GET_EXPENSE:
        return {
          ...state,
          expenses: action.payload,
        };
      case ADD_EXPENSE:
        return {
          ...state,
          expenses: action.payload,
        };
      default:
        return state;
    }
  }