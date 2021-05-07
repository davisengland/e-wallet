const initialState = {
    netWorth: '',
  };
  
  const GET_NET_WORTH = "GET_NET_WORTH";
  const ADD_NET_WORTH = "ADD_NET_WORTH"
  const UPDATE_NET_WORTH = "UPDATE_NET_WORTH";
  const LOGOUT_NET_WORTH = "LOGOUT_NET_WORTH";
  
  export function getNetWorth(payload) {
    return {
      type: GET_NET_WORTH,
      payload: payload,
    };
  }
  
  export function addNetWorth(payload) {
    return {
      type: ADD_NET_WORTH,
      payload: payload,
    };
  }
  
  export function updateNetWorth(payload) {
    return {
      type: UPDATE_NET_WORTH,
      payload: payload,
    };
  }
  
  export function logoutNetWorth() {
    return {
      type: LOGOUT_NET_WORTH,
      payload: initialState,
    };
  }
  
  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_NET_WORTH:
        return {
          ...state,
          netWorth: action.payload,
        };
      case ADD_NET_WORTH:
        return {
          netWorth: action.payload,
        };
      case UPDATE_NET_WORTH:
        return {
          ...state,
          netWorth: action.payload,
        };
      case LOGOUT_NET_WORTH:
        return initialState;
      default:
        return state;
    }
  }
  