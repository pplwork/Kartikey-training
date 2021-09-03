const initialState = {
  user: {},
  screen: "",
  bottomDrawer: { visible: false, content: [] },
  selected: "",
  multiSelected: [],
  enableMultiselect: false,
  caption: "",
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
    case "SET_SELECTED": {
      return {
        ...state,
        selected: action.payload,
      };
    }
    case "SET_MULTISELECTED": {
      return {
        ...state,
        multiSelected: action.payload,
      };
    }
    case "SET_ENABLEMULTISELECT": {
      return {
        ...state,
        enableMultiselect: action.payload,
      };
    }
    case "SET_CAPTION": {
      return {
        ...state,
        caption: action.payload,
      };
    }
    case "LAUNCH_RESET": {
      return {
        ...state,
        bottomDrawer: { visible: false, content: [] },
        selected: "",
        multiSelected: [],
        enableMultiselect: false,
        caption: "",
      };
    }
    default:
      return state;
  }
};

export default rootreducer;
