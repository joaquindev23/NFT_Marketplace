import {
  COMPOSE_NEW_INBOX_TRUE,
  COMPOSE_NEW_INBOX_FALSE,
  SET_INBOXES_TRUE,
  SET_INBOXES_FALSE,
  SELECT_INBOX_LIST,
  SET_VIDEO_SOURCE_TRUE,
  SET_VIDEO_SOURCE_FALSE,
  SET_VIDEO_CALL_TRUE,
  SET_VIDEO_CALL_FALSE,
} from './types';

export const setInboxList = (option) => (dispatch) => {
  dispatch({ type: SELECT_INBOX_LIST, payload: option });
};

export const setComposeNewinbox = () => (dispatch) => {
  dispatch({ type: COMPOSE_NEW_INBOX_TRUE });
};

export const resetComposeNewInbox = () => (dispatch) => {
  dispatch({ type: COMPOSE_NEW_INBOX_FALSE });
};

export const setInboxes = () => (dispatch) => {
  dispatch({ type: SET_INBOXES_TRUE });
};

export const resetInboxes = () => (dispatch) => {
  dispatch({ type: SET_INBOXES_FALSE });
};

export const setVideoSrc = (src) => (dispatch) => {
  dispatch({ type: SET_VIDEO_SOURCE_TRUE, payload: src });
};

export const resetVideoSrc = () => (dispatch) => {
  dispatch({ type: SET_VIDEO_SOURCE_FALSE });
};

export const setIsInVideoCall = () => (dispatch) => {
  dispatch({ type: SET_VIDEO_CALL_TRUE });
};

export const resetIsInVideoCall = () => (dispatch) => {
  dispatch({ type: SET_VIDEO_CALL_FALSE });
};
