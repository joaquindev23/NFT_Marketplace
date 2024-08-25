import {
  GET_FRIENDS_LIST_SUCCESS,
  GET_FRIENDS_LIST_FAIL,
  GET_FRIEND_REQUESTS_LIST_SUCCESS,
  GET_FRIEND_REQUESTS_LIST_FAIL,
  CONNECT_WEBSOCKET,
  DISCONNECT_WEBSOCKET,
} from './types';

export const setFriendsList = (data) => (dispatch) => {
  dispatch({
    type: GET_FRIENDS_LIST_SUCCESS,
    payload: data,
  });
};

export const resetFriendsList = () => (dispatch) => {
  dispatch({
    type: GET_FRIENDS_LIST_FAIL,
  });
};

export const setFriendRequestsList = (data) => (dispatch) => {
  dispatch({
    type: GET_FRIEND_REQUESTS_LIST_SUCCESS,
    payload: data,
  });
};

export const resetFriendRequestsList = () => (dispatch) => {
  dispatch({
    type: GET_FRIEND_REQUESTS_LIST_FAIL,
  });
};

// Action creators
export const connectWebSocket = (client) => ({
  type: CONNECT_WEBSOCKET,
  payload: client,
});

export const disconnectWebSocket = () => ({
  type: DISCONNECT_WEBSOCKET,
});
