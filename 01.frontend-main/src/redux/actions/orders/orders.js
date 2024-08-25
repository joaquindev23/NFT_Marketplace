import axios from 'axios';
import { CREATE_ORDER_FAIL, CREATE_ORDER_SUCCESS, CREATING_ORDER } from './types';
// import { ToastError } from '../../../components/ToastError';

export const createOrder = (userID, address, cartItems) => async (dispatch) => {
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
      `${process.env.NEXT_PUBLIC_APP_ORDERS_URL}/api/orders/create/`,
      body,
      config,
    );

    dispatch({
      type: CREATING_ORDER,
    });
    if (res.status === 200) {
      dispatch({
        type: CREATE_ORDER_SUCCESS,
      });
    } else {
      dispatch({
        type: CREATE_ORDER_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: CREATE_ORDER_FAIL,
    });
  }
};

export const resetOrder = () => async (dispatch) => {
  dispatch({
    type: CREATE_ORDER_FAIL,
  });
};
