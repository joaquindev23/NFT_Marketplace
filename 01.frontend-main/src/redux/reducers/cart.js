/* eslint-disable default-param-last */
import {
  ADD_ITEM,
  GET_TOTAL,
  GET_ITEM_TOTAL,
  GET_ITEMS,
  UPDATE_ITEM,
  REMOVE_ITEM,
  EMPTY_CART,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAIL,
  GET_TOTAL_SUCCESS,
  GET_TOTAL_FAIL,
  GET_ITEM_TOTAL_SUCCESS,
  GET_ITEM_TOTAL_FAIL,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAIL,
  UPDATE_ITEM_SUCCESS,
  UPDATE_ITEM_FAIL,
  REMOVE_ITEM_SUCCESS,
  REMOVE_ITEM_FAIL,
  EMPTY_CART_SUCCESS,
  EMPTY_CART_FAIL,
  SYNCH_CART_SUCCESS,
  SYNCH_CART_FAIL,
  CLOSE_CART,
  OPEN_CART,
  CHECKOUT_LOADING_SUCCESS,
  CHECKOUT_LOADING_FAIL,
  GET_PRODUCTS_FROM_LIST_SUCCESS,
  GET_PRODUCTS_FROM_LIST_FAIL,
  GET_COURSES_FROM_LIST_SUCCESS,
  GET_COURSES_FROM_LIST_FAIL,
} from '../actions/cart/types';

const initialState = {
  items: [],
  courses: [],
  products: [],
  amount: 0.0,
  compare_amount: 0.0,
  shipping_estimate: 0.0,
  tax_estimate: 0.0,
  total_compare_cost: 0.0,
  total_cost: 0.0,
  finalPrice: 0.0,
  total_cost_ethereum: 0.0,
  maticCost: 0.0,
  total_items: 0,
  open: false,
  checkout_loading: false,
};

export default function cart(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_COURSES_FROM_LIST_SUCCESS:
      return {
        ...state,
        courses: payload,
      };
    case GET_COURSES_FROM_LIST_FAIL:
      return {
        ...state,
        courses: [],
      };
    case GET_PRODUCTS_FROM_LIST_SUCCESS:
      return {
        ...state,
        products: payload,
      };
    case GET_PRODUCTS_FROM_LIST_FAIL:
      return {
        ...state,
        products: [],
      };
    case CHECKOUT_LOADING_SUCCESS:
      return {
        ...state,
        checkout_loading: true,
      };
    case CHECKOUT_LOADING_FAIL:
      return {
        ...state,
        checkout_loading: false,
      };
    case OPEN_CART:
      return {
        ...state,
        open: true,
      };
    case CLOSE_CART:
      return {
        ...state,
        open: false,
      };
    case ADD_ITEM_FAIL:
      return {
        ...state,
      };
    case ADD_ITEM:
      localStorage.setItem('cart', JSON.stringify(payload));
      return {
        ...state,
        items: JSON.parse(localStorage.getItem('cart')),
      };
    case ADD_ITEM_SUCCESS:
    case REMOVE_ITEM_SUCCESS:
    case UPDATE_ITEM_SUCCESS:
    case GET_ITEMS_SUCCESS:
      return {
        ...state,
        items: payload.cart,
        total_items: payload.total_items,
      };
    case GET_ITEMS_FAIL:
      return {
        ...state,
        items: null,
        total_items: null,
      };
    case GET_ITEMS:
      return {
        ...state,
        items: JSON.parse(localStorage.getItem('cart')),
      };
    case GET_TOTAL_SUCCESS:
      return {
        ...state,
        amount: payload.total_cost,
        total_cost_ethereum: payload.total_cost_ethereum,
        maticCost: payload.maticCost,
        finalPrice: payload.finalPrice,
        compare_amount: payload.total_compare_cost,
        tax_estimate: payload.tax_estimate,
        shipping_estimate: payload.shipping_estimate,
      };
    case GET_TOTAL_FAIL:
      return {
        ...state,
        amount: 0.0,
        compare_amount: 0.0,
        tax_estimate: 0.0,
        shipping_estimate: 0.0,
        total_cost_ethereum: 0.0,
        finalPrice: 0.0,
      };
    case GET_TOTAL:
      return {
        ...state,
        amount: payload[0],
        compare_amount: payload[1],
      };
    case GET_ITEM_TOTAL_SUCCESS:
      return {
        ...state,
        total_items: payload.total_items,
      };
    case GET_ITEM_TOTAL_FAIL:
      return {
        ...state,
        total_items: 0,
      };
    case GET_ITEM_TOTAL:
      return {
        ...state,
        total_items: payload,
      };
    case UPDATE_ITEM_FAIL:
      return {
        ...state,
      };
    case UPDATE_ITEM:
      localStorage.setItem('cart', JSON.stringify(payload));
      return {
        ...state,
        items: JSON.parse(localStorage.getItem('cart')),
      };

    case REMOVE_ITEM_FAIL:
      return {
        ...state,
      };
    case REMOVE_ITEM:
      return {
        ...state,
        items: payload,
      };
    case EMPTY_CART_SUCCESS:
    case EMPTY_CART_FAIL:
      return {
        ...state,
        items: null,
        amount: 0.0,
        compare_amount: 0.0,
        tax_estimate: 0.0,
        shipping_estimate: 0.0,
        total_cost_ethereum: 0.0,
        finalPrice: 0.0,
      };
    case EMPTY_CART:
      localStorage.removeItem('cart');
      return {
        items: null,
        amount: 0.0,
        compare_amount: 0.0,
        tax_estimate: 0.0,
        shipping_estimate: 0.0,
        total_cost_ethereum: 0.0,
        finalPrice: 0.0,
      };
    case SYNCH_CART_SUCCESS:
    case SYNCH_CART_FAIL:
      localStorage.removeItem('cart');
      return {
        ...state,
      };
    default:
      return state;
  }
}
