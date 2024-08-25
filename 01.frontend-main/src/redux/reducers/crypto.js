/* eslint-disable default-param-last */

import {
  GET_ETHEREUM_PRICE_SUCCESS,
  GET_ETHEREUM_PRICE_FAIL,
  GET_TRANSACTIONS_SUCCESS,
  GET_TRANSACTIONS_FAIL,
  GET_CARDANO_PRICE_SUCCESS,
  GET_CARDANO_PRICE_FAIL,
  PAYMENT_SUCCESS,
  PAYMENT_FAIL,
  SEND_ETHEREUM_SUCCESS,
  SEND_ETHEREUM_FAIL,
  GET_TOKENS_SUCCESS,
  GET_TOKENS_FAIL,
  GET_POLYGON_TOKENS_FAIL,
  GET_POLYGON_TOKENS_SUCCESS,
  GET_TOKENS_COUNT_SUCCESS,
  SEND_TOKENS_SUCCESS,
  SEND_TOKENS_FAIL,
  SET_SENDING_TOKENS,
} from '../actions/crypto/types';

const initialState = {
  eth_price: null,
  ada_price: null,
  transactions: null,
  count: null,
  next: null,
  previous: null,
  payment_success: false,
  tx_hash: null,
  txHashes: null,
  tokens: [],
  polygonTokens: [],
  sending_tokens: false,
};

export default function crypto(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_SENDING_TOKENS:
      return {
        ...state,
        sending_tokens: payload,
      };
    case SEND_TOKENS_SUCCESS:
      return {
        ...state,
        sending_tokens: false,
        tx_hash: payload,
      };
    case SEND_TOKENS_FAIL:
      return {
        ...state,
        sending_tokens: false,
      };
    case GET_TOKENS_FAIL:
      return {
        ...state,
        tokens: [],
      };
    case GET_TOKENS_SUCCESS:
      return {
        ...state,
        tokens: payload,
      };
    case GET_TOKENS_COUNT_SUCCESS:
      return {
        ...state,
        count: payload,
      };
    case GET_POLYGON_TOKENS_SUCCESS:
      return {
        ...state,
        polygonTokens: [],
      };
    case GET_POLYGON_TOKENS_FAIL:
      return {
        ...state,
        polygonTokens: payload,
      };
    case SEND_ETHEREUM_SUCCESS:
      return {
        ...state,
        tx_hash: payload,
      };
    case SEND_ETHEREUM_FAIL:
      return {
        ...state,
        tx_hash: null,
      };
    case PAYMENT_SUCCESS:
      return {
        ...state,
        payment_success: true,
        txHashes: payload.transaction_hashes,
      };
    case PAYMENT_FAIL:
      return {
        ...state,
        payment_success: false,
      };
    case GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: payload.results.transactions,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
      };
    case GET_TRANSACTIONS_FAIL:
      return {
        ...state,
        transactions: [],
        count: null,
        next: null,
        previous: null,
      };

    case GET_ETHEREUM_PRICE_SUCCESS:
      return {
        ...state,
        eth_price: payload,
      };
    case GET_ETHEREUM_PRICE_FAIL:
      return {
        ...state,
        eth_price: null,
      };
    case GET_CARDANO_PRICE_SUCCESS:
      return {
        ...state,
        ada_price: payload,
      };
    case GET_CARDANO_PRICE_FAIL:
      return {
        ...state,
        ada_price: null,
      };

    default:
      return state;
  }
}
