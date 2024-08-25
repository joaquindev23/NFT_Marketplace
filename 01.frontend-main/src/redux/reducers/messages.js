/* eslint-disable default-param-last */
import {
  SET_INBOXES_TRUE,
  SET_INBOXES_FALSE,
  SET_INBOXES_COUNT_TRUE,
  SET_INBOXES_COUNT_FALSE,
} from '../actions/messages/types';

const initialState = {
  inboxes: [],
  count: 0,
};

export default function chat(state = initialState, action) {
  // eslint-disable-next-line
  const { type, payload } = action;

  switch (type) {
    case SET_INBOXES_TRUE:
      return {
        ...state,
        inboxes: payload,
      };
    case SET_INBOXES_FALSE:
      return {
        ...state,
        inboxes: [],
      };
    case SET_INBOXES_COUNT_TRUE:
      return {
        ...state,
        count: payload,
      };
    case SET_INBOXES_COUNT_FALSE:
      return {
        ...state,
        count: 0,
      };
    default:
      return state;
  }
}
