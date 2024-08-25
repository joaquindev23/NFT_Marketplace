import axios from 'axios';

import { ToastError } from '../../../components/toast/ToastError';
import { ToastSuccess } from '../../../components/ToastSuccess';

import { GET_COUPON_SUCCESS, GET_COUPON_FAIL, UPDATE_COUPON_PRICE } from './types';

export const checkCoupon = (couponName, objectId, contentType) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.get(
      `${process.env.REACT_APP_COUPONS_API_URL}/api/coupons/check/?name=${couponName}&id=${objectId}&type=${contentType}`,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: GET_COUPON_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess('Coupon applied');
    } else {
      dispatch({
        type: GET_COUPON_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_COUPON_FAIL,
    });
    ToastError(`Error: ${err.response.data.error}`);
  }
};

export const removeCoupon = () => async (dispatch) => {
  dispatch({
    type: GET_COUPON_FAIL,
  });
};

export const updatePrice = (price) => async (dispatch) => {
  dispatch({
    type: UPDATE_COUPON_PRICE,
    payload: price,
  });
};
