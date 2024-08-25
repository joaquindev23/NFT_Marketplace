import { CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL } from '../actions/orders/types';

const initialState = {
  create_order_success: false,
};

export default function orders(state = initialState, action) {
  // eslint-disable-next-line
  const { type, payload } = action;

  switch (type) {
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        create_order_success: true,
      };
    case CREATE_ORDER_FAIL:
      return {
        ...state,
        create_order_success: false,
      };

    default:
      return state;
  }
}
