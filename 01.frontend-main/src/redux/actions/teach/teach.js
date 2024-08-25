import axios from 'axios';

import { BECOME_SELLER_SUCCESS, BECOME_SELLER_FAIL } from './types';
import { ToastError } from '@/components/toast/ToastError';
import { ToastSuccess } from '@/components/toast/ToastSuccess';
import { loadUser } from '../auth/auth';

// eslint-disable-next-line
export const becomeSeller = (userID) => async (dispatch) => {
  const body = JSON.stringify({ userID });
  console.log(body);

  try {
    const res = await axios.post('/api/teach/becomeSeller', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: BECOME_SELLER_SUCCESS,
      });
      await dispatch(loadUser());
      ToastSuccess('Instructor request sent successfully.');
    } else {
      dispatch({
        type: BECOME_SELLER_FAIL,
      });
      ToastError('Error requesting to become a seller.');
    }
  } catch (err) {
    dispatch({
      type: BECOME_SELLER_FAIL,
    });
    ToastError('Something went wrong. Please try again later.');
  }
};
