const initialState = {
  user: {},
  screen: "",
  bottomDrawer: { visible: false, content: [] },
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
    case "SET_DRAWER": {
      return {
        ...state,
        bottomDrawer: {
          visible: state.bottomDrawer.visible,
          content: action.payload,
        },
      };
    }
    case "OPEN_DRAWER": {
      return {
        ...state,
        bottomDrawer: {
          visible: true,
          content: state.bottomDrawer.content,
        },
      };
    }
    case "CLOSE_DRAWER": {
      return {
        ...state,
        bottomDrawer: {
          visible: false,
          content: state.bottomDrawer.content,
        },
      };
    }
    default:
      return state;
  }
};

export default rootreducer;
