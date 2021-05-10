const initialState = {
    income: [],
  };
  
  const GET_INCOME = "GET_INCOME";
  const ADD_INCOME = "ADD_INCOME";
  
  export function getIncome(payload) {
    return {
      type: GET_INCOME,
      payload: payload,
    };
  }
  
  export function addIncome(payload) {
    return {
      type: ADD_INCOME,
      payload: payload,
    };
  }
  
  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_INCOME:
        return {
          ...state,
          income: action.payload,
        };
      case ADD_INCOME:
        return {
          ...state,
          income: action.payload,
        };
      default:
        return state;
    }
  }