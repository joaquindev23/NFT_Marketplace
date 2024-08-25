import { GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL } from './types';

export const setNotifications = (data) => (dispatch) => {
  dispatch({
    type: GET_NOTIFICATIONS_SUCCESS,
    payload: data,
  });
};
export const resetNotifications = () => (dispatch) => {
  dispatch({
    type: GET_NOTIFICATIONS_FAIL,
  });
};
