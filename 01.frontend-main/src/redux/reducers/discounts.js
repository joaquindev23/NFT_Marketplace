/* eslint-disable default-param-last */
const initialState = {
  discount: false,
};

export default function coupons(state = initialState, action) {
  const { type } = action;

  switch (type) {
    default:
      return state;
  }
}
