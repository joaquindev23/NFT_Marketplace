import axios from 'axios';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import { ToastError } from '../../../components/toast/ToastError';
import { ToastSuccess } from '../../../components/ToastSuccess';
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  MY_USER_PROFILE_LOADED_SUCCESS,
  MY_USER_PROFILE_LOADED_FAIL,
  MY_USER_WALLET_LOADED_SUCCESS,
  MY_USER_WALLET_LOADED_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  REFRESH_SUCCESS,
  REFRESH_FAIL,
  USER_WALLET_BALANCE_LOADED_SUCCESS,
  USER_WALLET_BALANCE_LOADED_FAIL,
  GET_PRAEDIUM_BALANCE_SUCCESS,
  GET_PRAEDIUM_BALANCE_FAIL,
  GET_GALR_BALANCE_SUCCESS,
  GET_GALR_BALANCE_FAIL,
  GET_MATIC_BALANCE_SUCCESS,
  GET_MATIC_BALANCE_FAIL,
  GET_DELIVERY_SUCCESS,
  GET_DELIVERY_FAIL,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  GET_USER_CONTACTS_SUCCESS,
  GET_USER_CONTACTS_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  RESET_REGISTER_SUCCESS,
} from './types';

import PraediumToken from '@/contracts/PraediumToken.sol/PraediumToken.json';
import GalacticReserveToken from '@/contracts/GalacticReserveToken.sol/GalacticReserveToken.json';
import { synchCartAuthenticated } from '../cart/cart';

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_APP_RPC_ETH_PROVIDER),
);
const polygonWeb3 = new Web3(
  new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_APP_RPC_POLYGON_PROVIDER),
);

export const loadUser = () => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await res.json();

    if (res.status === 200) {
      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: data.user,
      });
    } else {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

export const getUser = (username) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };

    const body = JSON.stringify({
      username,
    });

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get_user`,
      body,
      config,
    );

    const data = await res.json();

    if (res.status === 200) {
      dispatch({
        type: GET_USER_SUCCESS,
        payload: data.user,
      });
    } else {
      dispatch({
        type: GET_USER_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_USER_FAIL,
    });
  }
};

// export const testCache = () => async () => {
//   try {
//     const config = {
//       headers: {
//         Accept: 'application/json',
//       },
//     };

//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/test_cache/`,
//       config,
//     );

//     if (res.status === 200) {
//       console.log(res.data.results);
//     } else {
//       console.log('Fetch Test Cache Failed');
//     }
//   } catch (err) {
//     console.log('Fetch Test Cache Failed');
//   }
// };

export const getUserDelivery = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };

    const res = await axios.get('/api/auth/getAddresses', config);

    if (res.status === 200) {
      dispatch({
        type: GET_DELIVERY_SUCCESS,
        payload: res.data.results,
      });
    } else {
      dispatch({
        type: GET_DELIVERY_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_DELIVERY_FAIL,
    });
  }
};

export const loadUserProfile = () => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/user_profile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    if (res.status === 200) {
      dispatch({
        type: MY_USER_PROFILE_LOADED_SUCCESS,
        payload: data.profile,
      });
    } else {
      dispatch({
        type: MY_USER_PROFILE_LOADED_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: MY_USER_PROFILE_LOADED_FAIL,
    });
  }
};

export const loadUserContacts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/contacts/my_contact_lists');

    if (res.status === 200) {
      dispatch({
        type: GET_USER_CONTACTS_SUCCESS,
        payload: res.data.results,
      });
    } else {
      dispatch({
        type: GET_USER_CONTACTS_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_USER_CONTACTS_FAIL,
    });
  }
};

export const loadUserWallet = () => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/user_wallet', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    if (res.status === 200) {
      Cookies.set('address', data.wallet.address, { expires: 365 });
      Cookies.set('polygonAddress', data.wallet.polygon_address, { expires: 365 });
      dispatch({
        type: MY_USER_WALLET_LOADED_SUCCESS,
        payload: data.wallet,
      });
    } else {
      dispatch({
        type: MY_USER_WALLET_LOADED_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: MY_USER_WALLET_LOADED_FAIL,
    });
  }
};

export const loadUriBalance = (address) => async (dispatch) => {
  try {
    // create instances of the ERC20 contracts
    const galacticReserveContract = new web3.eth.Contract(
      GalacticReserveToken.abi,
      process.env.NEXT_PUBLIC_APP_GALR_TOKEN_ADDRESS,
    );
    // get the token balances
    const galacticReserveBalance = await galacticReserveContract.methods.balanceOf(address).call();

    dispatch({
      type: GET_GALR_BALANCE_SUCCESS,
      payload: web3.utils.fromWei(galacticReserveBalance, 'ether'),
    });
  } catch (err) {
    dispatch({
      type: GET_GALR_BALANCE_FAIL,
    });
  }
};

export const loadPraediumBalance = (address) => async (dispatch) => {
  try {
    const praediumContract = new web3.eth.Contract(
      PraediumToken.abi,
      process.env.NEXT_PUBLIC_APP_PDM_TOKEN_ADDRESS,
    );
    const praediumBalance = await praediumContract.methods.balanceOf(address).call();

    dispatch({
      type: GET_PRAEDIUM_BALANCE_SUCCESS,
      payload: web3.utils.fromWei(praediumBalance, 'ether'),
    });
  } catch (err) {
    dispatch({
      type: GET_PRAEDIUM_BALANCE_FAIL,
    });
  }
};

export const loadEthereumBalance = (address) => async (dispatch) => {
  try {
    web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        // eslint-disable-next-line
        console.error(err);
      } else {
        dispatch({
          type: USER_WALLET_BALANCE_LOADED_SUCCESS,
          payload: web3.utils.fromWei(balance, 'ether'),
        });
      }
    });
  } catch (err) {
    dispatch({
      type: USER_WALLET_BALANCE_LOADED_FAIL,
    });
  }
};

export const loadMaticPolygonBalance = (address) => async (dispatch) => {
  try {
    polygonWeb3.eth.getBalance(address, (err, balance) => {
      if (err) {
        // eslint-disable-next-line
        console.error(err);
      } else {
        dispatch({
          type: GET_MATIC_BALANCE_SUCCESS,
          payload: polygonWeb3.utils.fromWei(balance, 'ether'),
        });
      }
    });
  } catch (err) {
    dispatch({
      type: GET_MATIC_BALANCE_FAIL,
    });
  }
};

export const loadWalletAndBalances = () => async (dispatch) => {
  const wallet = await dispatch(loadUserWallet());
  if (wallet) {
    const { address, polygon_address } = wallet;
    dispatch(loadEthereumBalance(address));
    dispatch(loadPraediumBalance(polygon_address));
    dispatch(loadGalrBalance(polygon_address));
    dispatch(loadMaticPolygonBalance(polygon_address));
  }
};

export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({
    email,
    password,
  });

  dispatch({
    type: SET_AUTH_LOADING,
  });

  try {
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (res.status === 200) {
      await dispatch(loadUser());
      await dispatch(loadUserProfile());
      await dispatch(loadUserContacts());
      await dispatch(loadUserWallet());
      await dispatch(synchCartAuthenticated());
      await dispatch({
        type: LOGIN_SUCCESS,
      });
    } else {
      dispatch({
        type: LOGIN_FAIL,
      });
      ToastError('Wrong email or password.');
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    ToastError('Wrong email or password.');
  }

  dispatch({
    type: REMOVE_AUTH_LOADING,
  });
};

export const register =
  (first_name, last_name, email, username, password, re_password, agreed) => async (dispatch) => {
    const body = JSON.stringify({
      first_name,
      last_name,
      email,
      username,
      password,
      re_password,
      agreed,
    });

    dispatch({
      type: SET_AUTH_LOADING,
    });

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });

      if (res.status === 201) {
        dispatch({
          type: SIGNUP_SUCCESS,
        });
        ToastSuccess('We have sent you an email, please click the link to verify your account.');
      } else {
        dispatch({
          type: SIGNUP_FAIL,
        });
        ToastError('Username or email already exist.');
        dispatch({
          type: REMOVE_AUTH_LOADING,
        });
      }
    } catch (err) {
      dispatch({
        type: SIGNUP_FAIL,
      });
      ToastError(err.request.response);
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    }

    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
  };

export const checkAuthStatus = () => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: AUTHENTICATED_SUCCESS,
      });
      await dispatch(loadUser());
      await dispatch(loadUserProfile());
      await dispatch(loadUserWallet());
      // dispatch(load_ethereum_balance());
      // dispatch(get_user_delivery());
      // dispatch(get_notifications());
      // dispatch(get_total());
      // dispatch(get_items());
      // dispatch(get_item_total());
    } else {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

export const refreshJWTToken = () => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 200) {
      await dispatch(checkAuthStatus());
      dispatch({
        type: REFRESH_SUCCESS,
      });
    } else {
      dispatch({
        type: REFRESH_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: REFRESH_FAIL,
    });
  }
};

export const activate = (uid, token) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    uid,
    token,
  });

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/activation/`,
      body,
      config,
    );

    if (res.status === 204) {
      dispatch({
        type: ACTIVATION_SUCCESS,
      });
      ToastSuccess('Cuenta activada correctamente');
    } else {
      dispatch({
        type: ACTIVATION_FAIL,
      });
      ToastError('error al activar cuenta');
    }

    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
    ToastError(err.request.response);
  }
};

export const resetRegisterSuccess = () => (dispatch) => {
  dispatch({
    type: RESET_REGISTER_SUCCESS,
  });
  dispatch({
    type: REMOVE_AUTH_LOADING,
  });
};

export const resetPassword = (email) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/reset_password/`,
      body,
      config,
    );

    if (res.status === 204) {
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
      });
      ToastSuccess('Te hemos enviado un correo');
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    } else {
      dispatch({
        type: RESET_PASSWORD_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      ToastError('Error con el servidor');
    }
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
    });
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
    ToastError(err.request.response);
  }
};

export const resendActivation = (email) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/resend_activation/`,
      body,
      config,
    );

    if (res.status === 204) {
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
      });
      ToastSuccess('Te hemos enviado un correo');
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    } else {
      dispatch({
        type: RESET_PASSWORD_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      ToastError('Error con el servidor');
    }
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
    });
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
    ToastError('Email does not exist');
  }
};

export const resetPasswordConfirm =
  (uid, token, newPassword, reNewPassword) => async (dispatch) => {
    dispatch({
      type: SET_AUTH_LOADING,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      uid,
      token,
      new_password: newPassword,
      re_new_password: reNewPassword,
    });

    if (newPassword !== reNewPassword) {
      dispatch({
        type: RESET_PASSWORD_CONFIRM_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    } else {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/reset_password_confirm/`,
          body,
          config,
        );

        if (res.status === 204) {
          dispatch({
            type: RESET_PASSWORD_CONFIRM_SUCCESS,
          });
          ToastSuccess('Contraseña cambiada correctamente');
          dispatch({
            type: REMOVE_AUTH_LOADING,
          });
        } else {
          dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL,
          });
          dispatch({
            type: REMOVE_AUTH_LOADING,
          });
          ToastError('Error con el servidor');
        }
      } catch (err) {
        dispatch({
          type: RESET_PASSWORD_CONFIRM_FAIL,
        });
        dispatch({
          type: REMOVE_AUTH_LOADING,
        });
        ToastError(err.request.response);
      }
    }
  };

export const logout = () => async (dispatch) => {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
      // localStorage.removeItem('persist:root', accounts[0]);
    } else {
      dispatch({
        type: LOGOUT_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: LOGOUT_FAIL,
    });
  }
};
