const undoReducer = (reducer) => {
  const INITIAL_STATE = {
    past: [],
    present: reducer(undefined, {}),
    futur: [],
  };

  return (state = INITIAL_STATE, action) => {
    const {past, present, futur} = state;

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length -1);
        return {
          ...state,
          past: newPast,
          present: previous,
          futur: [present, ...futur],
        };

      case 'REDO':
        const next = futur[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          futur: newFuture,
        };

      default:
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state;
        };
        return {
          past: [...past, present],
          present: newPresent,
          futur: [],
        }
    }
  };
};

export default undoReducer;