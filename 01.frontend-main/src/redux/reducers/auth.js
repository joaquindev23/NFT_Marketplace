/* eslint-disable default-param-last */
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT,
  RESET_REGISTER_SUCCESS,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  REFRESH_SUCCESS,
  REFRESH_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  MY_USER_PROFILE_LOADED_SUCCESS,
  MY_USER_PROFILE_LOADED_FAIL,
  MY_USER_WALLET_LOADED_SUCCESS,
  MY_USER_WALLET_LOADED_FAIL,
  USER_WALLET_BALANCE_LOADED_SUCCESS,
  USER_WALLET_BALANCE_LOADED_FAIL,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  GET_DELIVERY_SUCCESS,
  GET_DELIVERY_FAIL,
  SET_ACCESS_TOKEN,
  GET_PRAEDIUM_BALANCE_SUCCESS,
  GET_PRAEDIUM_BALANCE_FAIL,
  GET_GALR_BALANCE_SUCCESS,
  GET_GALR_BALANCE_FAIL,
  GET_MATIC_BALANCE_SUCCESS,
  GET_MATIC_BALANCE_FAIL,
  GET_USER_CONTACTS_SUCCESS,
  GET_USER_CONTACTS_FAIL,
} from '../actions/auth/types';

const initialState = {
  user: null,
  access: null,
  isAuthenticated: false,
  loading: false,
  user_loading: false,
  profile_loading: false,
  wallet_loading: false,
  register_success: false,
  profile: null,
  wallet: null,
  eth_balance: null,
  matic_balance: null,
  pdm_balance: null,
  galr_balance: null,
  eth_balance_loading: false,
  get_user: null,
  get_user_loading: false,
  delivery_address: null,
  sellerContacts: [],
  instructorContacts: [],
  friendContacts: [],
};

function setAccessTokenCookie(access, expireTime = 86400) {
  document.cookie = `access=${access}; path=/; max-age=${expireTime};`;
}

function removeAccessTokenCookie() {
  document.cookie = 'access=; path=/; max-age=0;';
}

function setWalletCookie(payload, expireTime = 86400) {
  document.cookie = `wallet=${payload}; path=/; max-age=${expireTime};`;
}

function removeWalletCookie() {
  document.cookie = 'wallet=; path=/; max-age=0;';
}

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        access: payload,
      };
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_AUTH_LOADING:
      return {
        ...state,
        loading: false,
      };
    case RESET_REGISTER_SUCCESS:
      return {
        ...state,
        register_success: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case GET_DELIVERY_SUCCESS:
      return {
        ...state,
        delivery_address: payload,
      };
    case GET_DELIVERY_FAIL:
      return {
        ...state,
        delivery_address: null,
      };
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        user: payload,
        user_loading: false,
      };
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
        user_loading: false,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        get_user: payload,
        get_user_loading: false,
      };
    case GET_USER_FAIL:
      return {
        ...state,
        get_user: null,
        get_user_loading: false,
        error_code: payload,
      };
    case USER_WALLET_BALANCE_LOADED_SUCCESS:
      return {
        ...state,
        eth_balance: payload,
        eth_balance_loading: false,
      };
    case USER_WALLET_BALANCE_LOADED_FAIL:
      return {
        ...state,
        eth_balance: null,
        eth_balance_loading: false,
      };
    case GET_PRAEDIUM_BALANCE_SUCCESS:
      return {
        ...state,
        pdm_balance: payload,
        // pdm_balance_loading: false,
      };
    case GET_PRAEDIUM_BALANCE_FAIL:
      return {
        ...state,
        pdm_balance: null,
        // pdm_balance_loading: false,
      };
    case GET_MATIC_BALANCE_SUCCESS:
      return {
        ...state,
        matic_balance: payload,
        // pdm_balance_loading: false,
      };
    case GET_MATIC_BALANCE_FAIL:
      return {
        ...state,
        matic_balance: null,
        // pdm_balance_loading: false,
      };
    case GET_GALR_BALANCE_SUCCESS:
      return {
        ...state,
        galr_balance: payload,
        // pdm_balance_loading: false,
      };
    case GET_GALR_BALANCE_FAIL:
      return {
        ...state,
        galr_balance: null,
        // pdm_balance_loading: false,
      };
    case MY_USER_PROFILE_LOADED_SUCCESS:
      return {
        ...state,
        profile: payload,
        profile_loading: false,
      };
    case MY_USER_PROFILE_LOADED_FAIL:
      return {
        ...state,
        profile: null,
        profile_loading: false,
      };
    case GET_USER_CONTACTS_SUCCESS:
      return {
        ...state,
        sellerContacts: payload.seller_contact_list,
        instructorContacts: payload.instructor_contact_list,
        friendContacts: payload.friend_contact_list,
      };
    case GET_USER_CONTACTS_FAIL:
      return {
        ...state,
        sellerContacts: null,
        instructorContacts: null,
        friendContacts: null,
      };
    case MY_USER_WALLET_LOADED_SUCCESS:
      return {
        ...state,
        wallet: payload,
        wallet_loading: false,
      };
    case MY_USER_WALLET_LOADED_FAIL:
      return {
        ...state,
        wallet: null,
        wallet_loading: false,
      };
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case REFRESH_SUCCESS:
      localStorage.setItem('access', payload.access);
      setAccessTokenCookie(payload.access);
      return {
        ...state,
        access: localStorage.getItem('access'),
      };
    case REFRESH_FAIL:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      removeAccessTokenCookie();
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case RESET_PASSWORD_SUCCESS:
    case RESET_PASSWORD_FAIL:
    case RESET_PASSWORD_CONFIRM_SUCCESS:
    case RESET_PASSWORD_CONFIRM_FAIL:
      return {
        ...state,
      };
    case ACTIVATION_SUCCESS:
    case ACTIVATION_FAIL:
      return {
        ...state,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        register_success: true,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
      };
    case LOGOUT:
      removeAccessTokenCookie();
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
