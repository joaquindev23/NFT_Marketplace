import { SET_TIME_ON_PAGE, RESET_TIME_ON_PAGE } from './types';

export const setWatchTime = (watchTime) => (dispatch) => {
  dispatch({
    type: SET_TIME_ON_PAGE,
    payload: watchTime,
  });
};

export const resetWatchTime = () => (dispatch) => {
  dispatch({ type: RESET_TIME_ON_PAGE });
};
