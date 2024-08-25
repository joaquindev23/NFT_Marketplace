import axios from 'axios';
import { ToastSuccess } from '../../../components/ToastSuccess';
import { loadMaticPolygonBalance } from '../auth/auth';
// import { ToastSuccess } from '../../../components/ToastSuccess';
// import { loadEthereumBalance, loadMaticPolygonBalance } from '../auth/auth';
// import { createOrder } from '../orders/orders';
// import { ToastError } from '../../../components/ToastError';
import {
  PAYMENT_FAIL,
  PAYMENT_SUCCESS,
  GET_POLYGON_TOKENS_FAIL,
  GET_POLYGON_TOKENS_SUCCESS,
  GET_TOKENS_FAIL,
  GET_TOKENS_SUCCESS,
  GET_TOKENS_COUNT_SUCCESS,
  GET_TOKENS_COUNT_FAIL,
  GET_POLYGON_TOKENS_COUNT_SUCCESS,
  GET_POLYGON_TOKENS_COUNT_FAIL,
  SEND_TOKENS_SUCCESS,
  SEND_TOKENS_FAIL,
  SET_SENDING_TOKENS,
} from './types';

export const cryptoPay = (userID, address, cartItems) => async (dispatch) => {
  const access = localStorage.getItem('access');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${access}`,
    },
  };

  const body = JSON.stringify({
    userID,
    address,
    cartItems,
  });

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PAYMENT_URL}/api/crypto/pay/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: PAYMENT_SUCCESS,
        payload: res.data.results,
      });
      dispatch(loadMaticPolygonBalance(address));
      ToastSuccess('Successfull Transaction');
    } else {
      dispatch({
        type: PAYMENT_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: PAYMENT_FAIL,
    });
  }
};

export const resetCryptoPayment = () => async (dispatch) => {
  dispatch({
    type: PAYMENT_FAIL,
  });
};

export const getTokens = (tokens) => async (dispatch) => {
  dispatch({
    type: GET_TOKENS_SUCCESS,
    payload: tokens,
  });
};

export const resetSendTokens = () => async (dispatch) => {
  dispatch({
    type: SET_SENDING_TOKENS,
    payload: false,
  });
};

export const sendTokens =
  (fromAccount, toAccount, amount, token, speed, gasLimit) => async (dispatch) => {
    try {
      dispatch({
        type: SET_SENDING_TOKENS,
        payload: true,
      });
      const response = await fetch('/api/tokens/sendTokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccount,
          toAccount,
          amount,
          token,
          speed,
          gasLimit,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: SEND_TOKENS_SUCCESS,
          payload: data.results,
        });
      } else {
        // const errorData = await response.json();
        dispatch({
          type: SEND_TOKENS_FAIL,
          // payload: errorData.error,
        });
      }
    } catch (error) {
      dispatch({
        type: SEND_TOKENS_FAIL,
        payload: 'Something went wrong while sending tokens',
      });
    }
  };

export const sendTokensPolygon =
  (fromAccount, toAccount, amount, token, speed, gasLimit) => async (dispatch) => {
    try {
      dispatch({
        type: SET_SENDING_TOKENS,
        payload: true,
      });
      const response = await fetch('/api/tokens/sendTokensPolygon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccount,
          toAccount,
          amount,
          token,
          speed,
          gasLimit,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: SEND_TOKENS_SUCCESS,
          payload: data.results,
        });
      } else {
        // const errorData = await response.json();
        dispatch({
          type: SEND_TOKENS_FAIL,
          // payload: errorData.error,
        });
      }
    } catch (error) {
      dispatch({
        type: SEND_TOKENS_FAIL,
        payload: 'Something went wrong while sending tokens',
      });
    }
  };
export const listTokens =
  (page, pageSize, maxPageSize, search, name, symbol, address, decimals, walletAddress) =>
  async (dispatch) => {
    try {
      const res = await fetch(
        `/api/tokens/getTokens?page=${page}&pageSize=${pageSize}&maxPageSize=${maxPageSize}&search=${search}&name=${name}&symbol=${symbol}&address=${address}&decimals=${decimals}&wallet=${walletAddress}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const data = await res.json();
      if (res.status === 200) {
        dispatch({
          type: GET_TOKENS_SUCCESS,
          payload: data.data.results,
        });
        dispatch({
          type: GET_TOKENS_COUNT_SUCCESS,
          payload: data.data.count,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      dispatch({
        type: GET_TOKENS_FAIL,
        payload: err.message,
      });
    }
  };

export const getPolygonTokens = (tokens) => async (dispatch) => {
  dispatch({
    type: GET_POLYGON_TOKENS_SUCCESS,
    payload: tokens,
  });
};

export const resetTokens = (tokens) => async (dispatch) => {
  dispatch({
    type: GET_TOKENS_FAIL,
    payload: tokens,
  });
};
export const resetPolygonTokens = (tokens) => async (dispatch) => {
  dispatch({
    type: GET_POLYGON_TOKENS_FAIL,
    payload: tokens,
  });
};
