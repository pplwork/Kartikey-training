const initState = {
  laps: [],
  isRunning: false,
  elapsed: 0,
  intervalId: null,
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "INCREMENT_TIME":
      return {
        ...state,
        elapsed: state.elapsed + 10,
      };
    case "SET_INTERVAL_ID":
      if (action.payload == null)
        return {
          ...state,
          isRunning: false,
          intervalId: action.payload,
        };
      return {
        ...state,
        isRunning: true,
        intervalId: action.payload,
        elapsed: state.intervalId === -1 ? 0 : state.elapsed,
      };
    case "STOP_WATCH":
      clearInterval(state.intervalId);
      return {
        ...state,
        isRunning: false,
        // -1 means to reset elapsed next time timer started
        intervalId: -1,
      };
    case "RESET_WATCH":
      if (!state.isRunning) {
        return {
          laps: [],
          isRunning: false,
          elapsed: 0,
          intervalId: null,
        };
      }
      return state;
    case "LAP":
      if (state.isRunning)
        return {
          ...state,
          laps: [
            ...state.laps,
            {
              splitTime: state.elapsed,
              lapTime:
                state.laps.length > 0
                  ? state.elapsed - state.laps.slice(-1)[0].splitTime
                  : state.elapsed,
            },
          ],
        };
      return state;
    default:
      return state;
  }
};

export default rootReducer;
