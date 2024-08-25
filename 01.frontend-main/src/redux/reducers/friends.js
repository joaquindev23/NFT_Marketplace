/* eslint-disable default-param-last */
import {
  GET_FRIENDS_LIST_SUCCESS,
  GET_FRIENDS_LIST_FAIL,
  GET_FRIEND_REQUESTS_LIST_SUCCESS,
  GET_FRIEND_REQUESTS_LIST_FAIL,
  CONNECT_WEBSOCKET,
  DISCONNECT_WEBSOCKET,
} from '../actions/friends/types';

const initialState = {
  friends: [],
  requests: [],
  wsclient: null,
};

export default function alert(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CONNECT_WEBSOCKET:
      return {
        ...state,
        client: action.payload,
      };
    case DISCONNECT_WEBSOCKET:
      return {
        ...state,
        client: null,
      };
    case GET_FRIENDS_LIST_SUCCESS:
      return {
        ...state,
        friends: payload,
      };
    case GET_FRIENDS_LIST_FAIL:
      return {
        ...state,
        friends: [],
      };
    case GET_FRIEND_REQUESTS_LIST_SUCCESS:
      return {
        ...state,
        requests: payload,
      };
    case GET_FRIEND_REQUESTS_LIST_FAIL:
      return {
        ...state,
        requests: [],
      };
    default:
      return state;
  }
}
