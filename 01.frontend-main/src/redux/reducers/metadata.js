/* eslint-disable default-param-last */
import { SET_METADATA } from '../actions/metadata/types';

const initialState = {
  metadata: null,
};

export default function alert(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_METADATA:
      return {
        ...state,
        metadata: payload,
      };
    default:
      return state;
  }
}
