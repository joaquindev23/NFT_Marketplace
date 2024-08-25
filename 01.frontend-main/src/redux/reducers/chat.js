/* eslint-disable default-param-last */
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
} from '../actions/chat/types';

const initialState = {
  compose_new_inbox: false,
  inboxes: [],
  select: 'friends',
  videoSrc: null,
  isInVideoCall: false,
};

export default function chat(state = initialState, action) {
  // eslint-disable-next-line
  const { type, payload } = action;

  switch (type) {
    case SELECT_INBOX_LIST:
      return {
        ...state,
        select: payload,
      };
    case COMPOSE_NEW_INBOX_TRUE:
      return {
        ...state,
        compose_new_inbox: true,
      };
    case COMPOSE_NEW_INBOX_FALSE:
      return {
        ...state,
        compose_new_inbox: false,
      };
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
    case SET_VIDEO_SOURCE_TRUE:
      return {
        ...state,
        videoSrc: payload,
      };
    case SET_VIDEO_SOURCE_FALSE:
      return {
        ...state,
        videoSrc: null,
      };
    case SET_VIDEO_CALL_TRUE:
      return {
        ...state,
        isInVideoCall: true,
      };
    case SET_VIDEO_CALL_FALSE:
      return {
        ...state,
        isInVideoCall: false,
      };
    default:
      return state;
  }
}
