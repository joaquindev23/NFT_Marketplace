import { SET_ALERT, REMOVE_ALERT, REMOVE_CTA_BANNER, REMOVE_DISCOUNT_BANNER } from './types';

export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT }), timeout);
  };

export const removeAlert = () => (dispatch) => {
  dispatch({ type: REMOVE_ALERT });
};

export const removeCTABanner = () => (dispatch) => {
  dispatch({ type: REMOVE_CTA_BANNER });
};

export const removeDiscountBanner = () => (dispatch) => {
  dispatch({ type: REMOVE_DISCOUNT_BANNER });
};
