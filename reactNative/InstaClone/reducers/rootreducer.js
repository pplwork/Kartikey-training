const initialState = {
  user: {},
  screen: "",
};

const rootreducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER": {
      return { ...state, user: action.payload, isLoggedIn: true };
    }
    case "SET_SCREEN": {
      return { ...state, screen: action.payload };
    }
    case "SIGNOUT": {
      return initialState;
    }
    default:
      return state;
  }
};

export default rootreducer;
