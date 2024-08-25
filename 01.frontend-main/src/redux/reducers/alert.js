/* eslint-disable default-param-last */
import {
  SET_ALERT,
  REMOVE_ALERT,
  REMOVE_CTA_BANNER,
  REMOVE_DISCOUNT_BANNER,
} from '../actions/alerts/types';

const initialState = {
  alert: null,
  remove_cta: false,
  remove_discount: false,
};

export default function alert(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        alert: payload,
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alert: null,
      };
    case REMOVE_CTA_BANNER:
      return {
        ...state,
        remove_cta: true,
      };
    case REMOVE_DISCOUNT_BANNER:
      return {
        ...state,
        remove_discount: true,
      };
    default:
      return state;
  }
}
