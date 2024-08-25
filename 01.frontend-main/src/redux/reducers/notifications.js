/* eslint-disable default-param-last */
import { GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAIL } from '../actions/notifications/types';

const initialState = {
  notifications: [],
};

export default function notification(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: payload,
      };
    case GET_NOTIFICATIONS_FAIL:
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
}
