import {
  SET_INBOXES_TRUE,
  SET_INBOXES_FALSE,
  SET_INBOXES_COUNT_TRUE,
  SET_INBOXES_COUNT_FALSE,
} from './types';

export const setInboxList = (data) => (dispatch) => {
  dispatch({ type: SET_INBOXES_TRUE, payload: data });
};

export const resetInboxList = () => (dispatch) => {
  dispatch({ type: SET_INBOXES_FALSE });
};

export const setInboxCount = (data) => (dispatch) => {
  dispatch({ type: SET_INBOXES_COUNT_TRUE, payload: data });
};

export const resetInboxCount = () => (dispatch) => {
  dispatch({ type: SET_INBOXES_COUNT_FALSE });
};
