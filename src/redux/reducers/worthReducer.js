const initialState = {
    worth: '',
  };
  
  const GET_WORTH = "GET_WORTH";
  const ADD_WORTH = "ADD_WORTH"
  const UPDATE_WORTH = "UPDATE_WORTH";
  const LOGOUT_WORTH = "LOGOUT_WORTH";
  
  export function get_worth(payload) {
    return {
      type: GET_WORTH,
      payload: payload,
    };
  }
  
  export function add_worth(payload) {
    return {
      type: ADD_WORTH,
      payload: payload,
    };
  }
  
  export function update_worth(payload) {
    return {
      type: UPDATE_WORTH,
      payload: payload,
    };
  }
  
  export function logout_worth() {
    return {
      type: LOGOUT_WORTH,
      payload: initialState,
    };
  }
  
  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_WORTH:
        return {
          ...state,
          worth: action.payload,
        };
      case ADD_WORTH:
        return {
          worth: action.payload,
        };
      case UPDATE_WORTH:
        return {
          ...state,
          worth: action.payload,
        };
      case LOGOUT_WORTH:
        return initialState;
      default:
        return state;
    }
  }
  