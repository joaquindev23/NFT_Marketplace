import { SET_TIME_ON_PAGE, RESET_TIME_ON_PAGE } from '../actions/analytics/types';

const initialState = {
  watchTime: 0,
};

export default function analytics(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_TIME_ON_PAGE:
      return {
        ...state,
        watchTime: payload,
      };
    case RESET_TIME_ON_PAGE:
      return {
        ...state,
        watchTime: 0,
      };
    default:
      return state;
  }
}
