import {
  GET_COUPON_SUCCESS,
  GET_COUPON_FAIL,
  LIST_COUPONS_SUCCESS,
  LIST_COUPONS_FAIL,
  UPDATE_COUPON_PRICE,
} from '../actions/coupons/types';

const initialState = {
  coupon: null,
  type: null,
  discount: null,
  coupons: null,
  price: null,
};

export default function coupons(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_COUPON_PRICE:
      return {
        ...state,
        price: payload,
      };
    case GET_COUPON_SUCCESS:
      return {
        ...state,
        coupon: payload.coupon,
        discount: payload.discount,
        type: payload.type,
      };
    case GET_COUPON_FAIL:
      return {
        ...state,
        coupon: null,
        type: null,
        price: null,
        discount: null,
      };
    case LIST_COUPONS_SUCCESS:
      return {
        ...state,
        coupons: payload.coupons,
      };
    case LIST_COUPONS_FAIL:
      return {
        ...state,
        coupons: null,
      };
    default:
      return state;
  }
}
