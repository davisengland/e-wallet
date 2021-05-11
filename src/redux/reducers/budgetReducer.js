const initialState = {
    budget: [],
  };
  
  const GET_BUDGETS = "GET_BUDGETS";
  const UPDATE_BUDGET = "UPDATE_BUDGET";
  const ADD_BUDGET = "ADD_BUDGET";
  
  export function getBudgets(payload) {
    return {
      type: GET_BUDGETS,
      payload: payload,
    };
  }
  
  export function updateBudget(payload) {
    return {
      type: UPDATE_BUDGET,
      payload: payload,
    };
  }
  
  export function addBudget(payload) {
    return {
      type: ADD_BUDGET,
      payload: payload,
    };
  }
  
  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_BUDGETS:
        return {
          ...state,
          budget: action.payload,
        };
      case UPDATE_BUDGET:
        return {
          ...state,
          budget: action.payload,
        };
      case ADD_BUDGET:
        return {
          ...state,
          budget: action.payload,
        };
      default:
        return state;
    }
  }