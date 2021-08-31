const initialState = {
  user: {},
  screen: "",
  isLoggedIn: false,
};

const rootreducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER": {
      return { ...state, user: action.payload };
    }
    case "SET_SCREEN": {
      return { ...state, screen: action.payload };
    }
    default:
      return state;
  }
};

export default rootreducer;
