import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import crypto from './crypto';
import cart from './cart';
import payment from './payment';
import orders from './orders';
import cookies from './cookies';
import notifications from './notifications';
import friends from './friends';
import messages from './messages';
import chat from './chat';
import user from './user';
import discounts from './discounts';
import courses from './courses';
import products from './products';
import create from './create';
import coupons from './coupons';
import analytics from './analytics';

export default combineReducers({
  alert,
  auth,
  crypto,
  cart,
  payment,
  orders,
  cookies,
  notifications,
  friends,
  messages,
  chat,
  user,
  discounts,
  courses,
  products,
  create,
  coupons,
  analytics,
});
