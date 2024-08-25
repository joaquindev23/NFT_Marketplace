import { v4 as uuidv4 } from 'uuid';

import {
  GET_COURSE_SUCCESS,
  GET_COURSE_FAIL,
  ADD_WHATLEARNT,
  REMOVE_WHATLEARNT,
  ON_CHANGE_COURSE_WHATLEARNT,
  UPDATE_DRAGGABLES_WHATLEARNT,
  ADD_REQUISITE,
  REMOVE_REQUISITE,
  ON_CHANGE_COURSE_REQUISITE,
  UPDATE_DRAGGABLES_REQUISITE,
  ADD_WHOISFOR,
  REMOVE_WHOISFOR,
  ON_CHANGE_COURSE_WHOISFOR,
  UPDATE_DRAGGABLES_WHOISFOR,
  ON_CHANGE_COURSE_TITLE,
  ON_CHANGE_COURSE_SUB_TITLE,
  ON_CHANGE_COURSE_DESCRIPTION,
  ON_CHANGE_COURSE_LANGUAGE,
  ON_CHANGE_COURSE_LEVEL,
  ON_CHANGE_COURSE_CATEGORY,
  ON_CHANGE_COURSE_IMAGE,
  ON_CHANGE_COURSE_VIDEO,
  ON_CHANGE_COURSE_TAUGHT,
  ADD_VIDEO,
  REMOVE_VIDEO,
  UPDATE_DRAGGABLES_VIDEO,
  ADD_IMAGE,
  REMOVE_IMAGE,
  UPDATE_DRAGGABLES_IMAGE,
  ON_CHANGE_COURSE_PRICE,
  ON_CHANGE_COURSE_COMPARE_PRICE,
  ON_CHANGE_COURSE_DISCOUNT_UNTIL,
  RESET_CREATE_VARIABLES,
  DEPLOY_COURSE_SUCCESS,
  DEPLOY_COURSE_FAIL,
} from '../actions/courses/types';

const initialState = {
  course: [],
  whatlearnt: [
    {
      id: uuidv4(),
      position_id: 0,
      title: '',
      example: 'Program Control and automation of lighting systems',
    },
    { id: uuidv4(), position_id: 1, title: '', example: 'Automate irrigation systems' },
    { id: uuidv4(), position_id: 2, title: '', example: 'Protect Home security systems' },
    { id: uuidv4(), position_id: 3, title: '', example: 'Create Robotics Schematics' },
  ],
  requisites: [
    {
      id: uuidv4(),
      position_id: 0,
      title: '',
      example: 'Previous knowledge in C#',
    },
  ],
  whoIsFor: [
    {
      id: uuidv4(),
      position_id: 0,
      title: '',
      example: 'Students',
    },
  ],
  videos: [],
  images: [],
  title: '',
  nft_deployed: false,
  txHash: '',
  sub_title: '',
  description: '',
  price: '',
  compare_price: '',
  discount_until: '',
  language: '',
  taught: '',
  level: '',
  congrats_message: '',
  welcome_message: '',
};

export default function courses(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_CREATE_VARIABLES:
      return {
        ...state,
        course: [],
        whatlearnt: [
          {
            id: uuidv4(),
            position_id: 0,
            title: '',
            example: 'Program Control and automation of lighting systems',
          },
          { id: uuidv4(), position_id: 1, title: '', example: 'Automate irrigation systems' },
          { id: uuidv4(), position_id: 2, title: '', example: 'Protect Home security systems' },
          { id: uuidv4(), position_id: 3, title: '', example: 'Create Robotics Schematics' },
        ],
        requisites: [
          {
            id: uuidv4(),
            position_id: 0,
            title: '',
            example: 'Previous knowledge in C#',
          },
        ],
        whoIsFor: [
          {
            id: uuidv4(),
            position_id: 0,
            title: '',
            example: 'Students',
          },
        ],
        videos: [],
        images: [],
        title: '',
        sub_title: '',
        description: '',
        price: '',
        compare_price: '',
        discount_until: '',
        language: '',
        taught: '',
        level: '',
        congrats_message: '',
        welcome_message: '',
      };
    case ADD_VIDEO:
      return {
        ...state,
        videos: [...state.videos, action.payload],
      };
    case REMOVE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.payload.id),
      };
    case ON_CHANGE_COURSE_VIDEO:
      return {
        ...state,
        videos: action.payload,
      };
    case UPDATE_DRAGGABLES_VIDEO:
      return {
        ...state,
        videos: action.payload,
      };

    case ADD_IMAGE:
      return {
        ...state,
        images: [...state.images, action.payload],
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        images: state.images.filter((image) => image.id !== action.payload.id),
      };
    case ON_CHANGE_COURSE_IMAGE:
      return {
        ...state,
        images: action.payload,
      };
    case UPDATE_DRAGGABLES_IMAGE:
      return {
        ...state,
        images: action.payload,
      };
    case ADD_WHATLEARNT:
      return {
        ...state,
        whatlearnt: [...state.whatlearnt, action.payload],
      };
    case REMOVE_WHATLEARNT:
      return {
        ...state,
        whatlearnt: state.whatlearnt.filter((whatlearnt) => whatlearnt.id !== action.payload.id),
      };
    case ON_CHANGE_COURSE_WHATLEARNT:
      return {
        ...state,
        whatlearnt: action.payload,
      };
    case UPDATE_DRAGGABLES_WHATLEARNT:
      return {
        ...state,
        whatlearnt: action.payload,
      };

    case ADD_REQUISITE:
      return {
        ...state,
        requisites: [...state.requisites, action.payload],
      };
    case REMOVE_REQUISITE:
      return {
        ...state,
        requisites: state.requisites.filter((requisites) => requisites.id !== action.payload.id),
      };
    case ON_CHANGE_COURSE_REQUISITE:
      return {
        ...state,
        requisites: action.payload,
      };
    case UPDATE_DRAGGABLES_REQUISITE:
      return {
        ...state,
        requisites: action.payload,
      };

    case ADD_WHOISFOR:
      return {
        ...state,
        whoIsFor: [...state.whoIsFor, action.payload],
      };
    case REMOVE_WHOISFOR:
      return {
        ...state,
        whoIsFor: state.whoIsFor.filter((whoIsFor) => whoIsFor.id !== action.payload.id),
      };
    case ON_CHANGE_COURSE_WHOISFOR:
      return {
        ...state,
        whoIsFor: action.payload,
      };
    case UPDATE_DRAGGABLES_WHOISFOR:
      return {
        ...state,
        whoIsFor: action.payload,
      };

    case ON_CHANGE_COURSE_PRICE:
      return {
        ...state,
        price: action.payload,
      };
    case ON_CHANGE_COURSE_COMPARE_PRICE:
      return {
        ...state,
        compare_price: action.payload,
      };
    case ON_CHANGE_COURSE_DISCOUNT_UNTIL:
      return {
        ...state,
        discount_until: action.payload,
      };

    case ON_CHANGE_COURSE_TITLE:
      return {
        ...state,
        title: payload,
      };
    case ON_CHANGE_COURSE_SUB_TITLE:
      return {
        ...state,
        sub_title: payload,
      };
    case ON_CHANGE_COURSE_DESCRIPTION:
      return {
        ...state,
        description: payload,
      };
    case ON_CHANGE_COURSE_TAUGHT:
      return {
        ...state,
        taught: payload,
      };
    case ON_CHANGE_COURSE_LANGUAGE:
      return {
        ...state,
        language: payload,
      };
    case ON_CHANGE_COURSE_LEVEL:
      return {
        ...state,
        level: payload,
      };
    case ON_CHANGE_COURSE_CATEGORY:
      return {
        ...state,
        category: payload,
      };
    case GET_COURSE_SUCCESS:
      return {
        ...state,
        course: payload,
      };
    case GET_COURSE_FAIL:
      return {
        ...state,
        course: null,
      };

    case DEPLOY_COURSE_SUCCESS:
      return {
        ...state,
        nft_deployed: true,
        txHash: payload,
      };
    case DEPLOY_COURSE_FAIL:
      return {
        ...state,
        nft_deployed: false,
        txHash: '',
      };
    default:
      return state;
  }
}
