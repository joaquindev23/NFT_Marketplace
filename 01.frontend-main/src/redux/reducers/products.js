import { v4 as uuidv4 } from 'uuid';
import {
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAIL,
  ONCHANGE_GOALS_WHATLEARNT_SUCCESS,
  ONCHANGE_GOALS_REQUIREMENTS_SUCCESS,
  ONCHANGE_GOALS_REQUIREMENTS_FAIL,
  ONCHANGE_GOALS_WHOISFOR_SUCCESS,
  ONCHANGE_GOALS_WHOISFOR_FAIL,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAIL,
  ONCHANGE_PRODUCT_TITLE_SUCCESS,
  ONCHANGE_PRODUCT_TITLE_FAIL,
  ONCHANGE_PRODUCT_SUB_TITLE_SUCCESS,
  ONCHANGE_PRODUCT_SUB_TITLE_FAIL,
  ONCHANGE_PRODUCT_DESCRIPTION_SUCCESS,
  ONCHANGE_PRODUCT_DESCRIPTION_FAIL,
  ONCHANGE_PRODUCT_LANGUAGE_SUCCESS,
  ONCHANGE_PRODUCT_LANGUAGE_FAIL,
  ONCHANGE_PRODUCT_LEVEL_SUCCESS,
  ONCHANGE_PRODUCT_LEVEL_FAIL,
  ONCHANGE_PRODUCT_CATEGORY_SUCCESS,
  ONCHANGE_PRODUCT_CATEGORY_FAIL,
  ONCHANGE_PRODUCT_STOCK_SUCCESS,
  ONCHANGE_PRODUCT_STOCK_FAIL,
  ONCHANGE_PRODUCT_IMAGE_SUCCESS,
  ONCHANGE_PRODUCT_IMAGE_FAIL,
  ONCHANGE_PRODUCT_VIDEO_SUCCESS,
  ONCHANGE_PRODUCT_VIDEO_FAIL,
  ONCHANGE_PRODUCT_IMAGE_FILENAME_SUCCESS,
  ONCHANGE_PRODUCT_IMAGE_FILENAME_FAIL,
  ONCHANGE_PRODUCT_VIDEO_FILENAME_SUCCESS,
  ONCHANGE_PRODUCT_VIDEO_FILENAME_FAIL,
  PERCENTAGE_SALES_VIDEO_UPLOAD,
  PERCENTAGE_THUMBNAIL_UPLOAD,
  IMAGE_UPLOADED_SUCCESS,
  IMAGE_UPLOADED_FAIL,
  VIDEO_UPLOADED_SUCCESS,
  VIDEO_UPLOADED_FAIL,
  ONCHANGE_CONGRATS_MESSAGE_SUCCESS,
  ONCHANGE_CONGRATS_MESSAGE_FAIL,
  ONCHANGE_WELCOME_MESSAGE_SUCCESS,
  ONCHANGE_WELCOME_MESSAGE_FAIL,
  ON_CHANGE_PRODUCT_DETAIL,
  ONCHANGE_PRODUCT_DETAILS_FAIL,
  ONCHANGE_PRODUCT_SIZE_FAIL,
  ONCHANGE_PRODUCT_COLORS_SUCCESS,
  ONCHANGE_PRODUCT_COLORS_FAIL,
  EDIT_PRODUCT_DETAILS_SUCCESS,
  EDIT_PRODUCT_COLORS_SUCCESS,
  EDIT_PRODUCT_SIZES_SUCCESS,
  ADD_SIZE,
  REMOVE_SIZE,
  ADD_COLOR,
  REMOVE_COLOR,
  UPDATE_DRAGGABLES_SIZE,
  UPDATE_DRAGGABLES_COLOR,
  ON_CHANGE_PRODUCT_SIZES,
  REMOVE_DETAIL,
  UPDATE_DRAGGABLES_DETAIL,
  ADD_DETAIL,
  ONCHANGE_PRODUCT_DETAILS_SUCCESS,
  ADD_WHATLEARNT,
  REMOVE_WHATLEARNT,
  ON_CHANGE_PRODUCT_WHATLEARNT,
  UPDATE_DRAGGABLES_WHATLEARNT,
  ADD_WHOISFOR,
  REMOVE_WHOISFOR,
  ON_CHANGE_PRODUCT_WHOISFOR,
  UPDATE_DRAGGABLES_WHOISFOR,
  ADD_REQUISITE,
  REMOVE_REQUISITE,
  ON_CHANGE_PRODUCT_REQUISITE,
  UPDATE_DRAGGABLES_REQUISITE,
  ADD_WEIGHT,
  REMOVE_WEIGHT,
  ON_CHANGE_PRODUCT_WEIGHT,
  UPDATE_DRAGGABLES_WEIGHT,
  ADD_MATERIAL,
  REMOVE_MATERIAL,
  ON_CHANGE_PRODUCT_MATERIAL,
  UPDATE_DRAGGABLES_MATERIAL,
  ADD_SHIPPING,
  REMOVE_SHIPPING,
  ON_CHANGE_PRODUCT_SHIPPING,
  UPDATE_DRAGGABLES_SHIPPING,
  ADD_IMAGE,
  REMOVE_IMAGE,
  ON_CHANGE_PRODUCT_IMAGE,
  UPDATE_DRAGGABLES_IMAGE,
  ADD_VIDEO,
  REMOVE_VIDEO,
  ON_CHANGE_PRODUCT_VIDEO,
  UPDATE_DRAGGABLES_VIDEO,
  ADD_DOCUMENT,
  REMOVE_DOCUMENT,
  ON_CHANGE_PRODUCT_DOCUMENT,
  UPDATE_DRAGGABLES_DOCUMENT,
  ADD_RESOURCE,
  REMOVE_RESOURCE,
  ON_CHANGE_PRODUCT_RESOURCE,
  UPDATE_DRAGGABLES_RESOURCE,
  RESET_CREATE_VARIABLES,
  ON_CHANGE_PRODUCT_PRICE,
  ON_CHANGE_PRODUCT_COMPARE_PRICE,
  ON_CHANGE_PRODUCT_DISCOUNT_UNTIL,
} from '../actions/products/types';

const initialState = {
  product: null,
  whatlearnt: [
    {
      id: uuidv4(),
      position_id: 0,
      title: '',
      example: 'Control and automation of lighting systems',
    },
    { id: uuidv4(), position_id: 1, title: '', example: 'Automated irrigation systems' },
    { id: uuidv4(), position_id: 2, title: '', example: 'Home security systems' },
    { id: uuidv4(), position_id: 3, title: '', example: 'Robotics' },
  ],
  requisites: [{ id: uuidv4(), position_id: 0, title: '' }],
  weights: [{ id: uuidv4(), position_id: 0, title: '', price: 0.0, stock: 0 }],
  materials: [{ id: uuidv4(), position_id: 0, title: '', image: '', stock: 0, price: 0.0 }],
  whoIsFor: [{ id: uuidv4(), position_id: 0, title: '' }],
  documents: [{ id: uuidv4(), position_id: 0, title: '' }],
  resources: [{ id: uuidv4(), position_id: 0, title: '', file: '' }],
  videos: [],
  images: [],
  shipping: [{ id: uuidv4(), position_id: 0, title: '', price: 0.0, time: 0 }],
  detail: [
    {
      id: uuidv4(),
      position_id: 0,
      title: '',
      body: '',
      example: 'Low cost computing',
      placeholder: 'The Raspberry Pi is a small, low-cost computer that is about the size of...',
    },
    {
      id: uuidv4(),
      position_id: 1,
      title: '',
      body: '',
      example: 'Designed for educational DiY',
      placeholder: 'It is designed for use in educational and DIY projects, and can be used to...',
    },
    {
      id: uuidv4(),
      position_id: 2,
      title: '',
      body: '',
      example: 'Variety of ports',
      placeholder:
        'The Raspberry Pi comes with a variety of ports and interfaces, including USB...',
    },
    {
      id: uuidv4(),
      position_id: 3,
      title: '',
      body: '',
      example: 'Linux-based operating system',
      placeholder: 'The Raspberry Pi runs on a Linux-based operating system and can be...',
    },
  ],
  sizes: [{ id: uuidv4(), position_id: 0, title: '', price: 0.0, stock: 0 }],
  colors: [{ id: uuidv4(), position_id: 0, title: '', hex: '#000000' }],
  title: '',
  sub_title: '',
  description: '',
  price: '',
  compare_price: '',
  discount_until: '',
  language: '',
  level: '',
  stock: '',
  congrats_message: '',
  welcome_message: '',
  image: '',
  image_filename: '',
  image_uploaded: false,
  video: '',
  video_filename: '',
  video_uploaded: false,
  percentage_image: 0,
  percentage_video: 0,
};

export default function products(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_CREATE_VARIABLES:
      return {
        ...state,
        whatlearnt: [
          {
            id: uuidv4(),
            position_id: 0,
            title: '',
            example: 'Control and automation of lighting systems',
          },
          { id: uuidv4(), position_id: 1, title: '', example: 'Automated irrigation systems' },
          { id: uuidv4(), position_id: 2, title: '', example: 'Home security systems' },
          { id: uuidv4(), position_id: 3, title: '', example: 'Robotics' },
        ],
        requisites: [{ id: uuidv4(), position_id: 0, title: '' }],
        weights: [{ id: uuidv4(), position_id: 0, title: '', price: 0.0, stock: 0 }],
        materials: [{ id: uuidv4(), position_id: 0, title: '', image: '', stock: 0, price: 0.0 }],
        whoIsFor: [{ id: uuidv4(), position_id: 0, title: '' }],
        documents: [],
        resources: [{ id: uuidv4(), position_id: 0, title: '', file: '' }],
        videos: [],
        images: [],
        price: '',
        discount_until: '',
        compare_price: '',
        shipping: [{ id: uuidv4(), position_id: 0, title: '', price: 0.0, time: 0 }],
        sizes: [{ id: uuidv4(), position_id: 0, title: '', price: 0.0, stock: 0 }],
        colors: [{ id: uuidv4(), position_id: 0, title: '', hex: '#000000' }],
        detail: [
          {
            id: uuidv4(),
            position_id: 0,
            title: '',
            body: '',
            example: 'Low cost computing',
            placeholder:
              'The Raspberry Pi is a small, low-cost computer that is about the size of a credit card.',
          },
          {
            id: uuidv4(),
            position_id: 1,
            title: '',
            body: '',
            example: 'Designed for educational DiY',
            placeholder:
              'It is designed for use in educational and DIY projects, and can be used to learn programming, build home...',
          },
          {
            id: uuidv4(),
            position_id: 2,
            title: '',
            body: '',
            example: 'Variety of ports',
            placeholder:
              'The Raspberry Pi comes with a variety of ports and interfaces, including USB, HDMI, and Ethernet, as well as a...',
          },
          {
            id: uuidv4(),
            position_id: 3,
            title: '',
            body: '',
            example: 'Linux-based operating system',
            placeholder:
              'The Raspberry Pi runs on a Linux-based operating system and can be programmed using a variety of...',
          },
        ],
      };

    case ADD_DOCUMENT:
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case REMOVE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((documents, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_DOCUMENT:
      return {
        ...state,
        documents: action.payload,
      };
    case UPDATE_DRAGGABLES_DOCUMENT:
      return {
        ...state,
        documents: action.payload,
      };

    case ADD_RESOURCE:
      return {
        ...state,
        resources: [...state.resources, action.payload],
      };
    case REMOVE_RESOURCE:
      return {
        ...state,
        resources: state.resources.filter((resources, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_RESOURCE:
      return {
        ...state,
        resources: action.payload,
      };
    case UPDATE_DRAGGABLES_RESOURCE:
      return {
        ...state,
        resources: action.payload,
      };

    case ON_CHANGE_PRODUCT_PRICE:
      return {
        ...state,
        price: action.payload,
      };
    case ON_CHANGE_PRODUCT_COMPARE_PRICE:
      return {
        ...state,
        compare_price: action.payload,
      };
    case ON_CHANGE_PRODUCT_DISCOUNT_UNTIL:
      return {
        ...state,
        discount_until: action.payload,
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
    case ON_CHANGE_PRODUCT_VIDEO:
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
    case ON_CHANGE_PRODUCT_IMAGE:
      return {
        ...state,
        images: action.payload,
      };
    case UPDATE_DRAGGABLES_IMAGE:
      return {
        ...state,
        images: action.payload,
      };

    case ADD_SHIPPING:
      return {
        ...state,
        shipping: [...state.shipping, action.payload],
      };
    case REMOVE_SHIPPING:
      return {
        ...state,
        shipping: state.shipping.filter((shipping, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_SHIPPING:
      return {
        ...state,
        shipping: action.payload,
      };
    case UPDATE_DRAGGABLES_SHIPPING:
      return {
        ...state,
        shipping: action.payload,
      };

    case ADD_WEIGHT:
      return {
        ...state,
        weights: [...state.weights, action.payload],
      };
    case REMOVE_WEIGHT:
      return {
        ...state,
        weights: state.weights.filter((weights, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_WEIGHT:
      return {
        ...state,
        weights: action.payload,
      };
    case UPDATE_DRAGGABLES_WEIGHT:
      return {
        ...state,
        weights: action.payload,
      };

    case ADD_MATERIAL:
      return {
        ...state,
        materials: [...state.materials, action.payload],
      };
    case REMOVE_MATERIAL:
      return {
        ...state,
        materials: state.materials.filter((materials, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_MATERIAL:
      return {
        ...state,
        materials: action.payload,
      };
    case UPDATE_DRAGGABLES_MATERIAL:
      return {
        ...state,
        materials: action.payload,
      };

    case ADD_WHATLEARNT:
      return {
        ...state,
        whatlearnt: [...state.whatlearnt, action.payload],
      };
    case REMOVE_WHATLEARNT:
      return {
        ...state,
        whatlearnt: state.whatlearnt.filter((whatlearnt, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_WHATLEARNT:
      return {
        ...state,
        whatlearnt: action.payload,
      };
    case UPDATE_DRAGGABLES_WHATLEARNT:
      return {
        ...state,
        whatlearnt: action.payload,
      };

    case ADD_WHOISFOR:
      return {
        ...state,
        whoIsFor: [...state.whoIsFor, action.payload],
      };
    case REMOVE_WHOISFOR:
      return {
        ...state,
        whoIsFor: state.whoIsFor.filter((whoIsFor, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_WHOISFOR:
      return {
        ...state,
        whoIsFor: action.payload,
      };
    case UPDATE_DRAGGABLES_WHOISFOR:
      return {
        ...state,
        whoIsFor: action.payload,
      };

    case ADD_REQUISITE:
      return {
        ...state,
        requisites: [...state.requisites, action.payload],
      };
    case REMOVE_REQUISITE:
      return {
        ...state,
        requisites: state.requisites.filter((requisites, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_REQUISITE:
      return {
        ...state,
        requisites: action.payload,
      };
    case UPDATE_DRAGGABLES_REQUISITE:
      return {
        ...state,
        requisites: action.payload,
      };

    case ONCHANGE_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        detail: payload,
      };
    case ONCHANGE_PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        detail: null,
      };
    case ADD_DETAIL:
      return {
        ...state,
        detail: [...state.detail, action.payload],
      };
    case REMOVE_DETAIL:
      // remove detail from state
      return {
        ...state,
        detail: state.detail.filter((detail, index) => index !== action.payload),
      };
    case ON_CHANGE_PRODUCT_DETAIL:
      // update detail in state
      return {
        ...state,
        detail: action.payload,
      };
    case UPDATE_DRAGGABLES_DETAIL:
      // update the draggable order of details
      return {
        ...state,
        detail: action.payload,
      };

    case ADD_COLOR:
      return {
        ...state,
        colors: [...state.colors, action.payload],
      };

    case REMOVE_COLOR:
      return {
        ...state,
        colors: state.colors.filter((color, i) => i !== action.payload),
      };
    case UPDATE_DRAGGABLES_COLOR:
      return {
        ...state,
        colors: action.payload,
      };
    case ADD_SIZE:
      return {
        ...state,
        sizes: [...state.sizes, action.payload],
      };
    case REMOVE_SIZE:
      return {
        ...state,
        sizes: state.sizes.filter((item, i) => i !== action.payload),
      };
    case UPDATE_DRAGGABLES_SIZE:
      return {
        ...state,
        sizes: action.payload,
      };

    case GET_PRODUCT_SUCCESS:
      return {
        ...state,
        product: payload,
      };
    case GET_PRODUCT_FAIL:
      return {
        ...state,
        product: null,
      };
    case ON_CHANGE_PRODUCT_SIZES:
      return {
        ...state,
        sizes: action.payload,
      };
    case ONCHANGE_PRODUCT_SIZE_FAIL:
      return {
        ...state,
        size: null,
      };
    case ONCHANGE_PRODUCT_COLORS_SUCCESS:
      return {
        ...state,
        color: payload,
      };
    case ONCHANGE_PRODUCT_COLORS_FAIL:
      return {
        ...state,
        color: null,
      };
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        product: payload,
        detail: [
          { id: uuidv4(), position_id: 0, title: '', body: '' },
          { id: uuidv4(), position_id: 1, title: '', body: '' },
          { id: uuidv4(), position_id: 2, title: '', body: '' },
          { id: uuidv4(), position_id: 3, title: '', body: '' },
        ],
        sizes: [{ id: uuidv4(), position_id: 0, title: '' }],
        colors: [{ id: uuidv4(), position_id: 0, title: '', hex: '#000000' }],
      };
    case CREATE_PRODUCT_FAIL:
      return {
        ...state,
        product: null,
      };

    case ONCHANGE_GOALS_WHATLEARNT_SUCCESS:
      return {
        ...state,
        whatlearnt: payload,
      };
    case ONCHANGE_GOALS_REQUIREMENTS_SUCCESS:
      return {
        ...state,
        requisites: payload,
      };
    case ONCHANGE_GOALS_REQUIREMENTS_FAIL:
      return {
        ...state,
        sizes: [{ id: uuidv4(), position_id: 0, title: '' }],
        colors: [{ id: uuidv4(), position_id: 0, title: '', hex: '#000000' }],
      };
    case EDIT_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        detail: [
          { id: uuidv4(), position_id: 0, title: '', body: '' },
          { id: uuidv4(), position_id: 1, title: '', body: '' },
          { id: uuidv4(), position_id: 2, title: '', body: '' },
          { id: uuidv4(), position_id: 3, title: '', body: '' },
        ],
        // product: payload,
      };
    case EDIT_PRODUCT_COLORS_SUCCESS:
      return {
        ...state,
        colors: [{ id: uuidv4(), position_id: 0, title: '', hex: '#000000' }],
      };
    case EDIT_PRODUCT_SIZES_SUCCESS:
      return {
        ...state,
        sizes: [{ id: uuidv4(), position_id: 0, title: '' }],
      };

    case ONCHANGE_GOALS_WHOISFOR_SUCCESS:
      return {
        ...state,
        whoIsFor: payload,
      };
    case ONCHANGE_GOALS_WHOISFOR_FAIL:
      return {
        ...state,
        sizes: [{ id: uuidv4(), position_id: 0, title: '' }],
        colors: [{ id: uuidv4(), position_id: 0, title: '', hex: '#000000' }],
      };

    case ONCHANGE_CONGRATS_MESSAGE_SUCCESS:
      return {
        ...state,
        congrats_message: payload,
      };
    case ONCHANGE_CONGRATS_MESSAGE_FAIL:
      return {
        ...state,
        congrats_message: null,
      };
    case ONCHANGE_WELCOME_MESSAGE_SUCCESS:
      return {
        ...state,
        welcome_message: payload,
      };
    case ONCHANGE_WELCOME_MESSAGE_FAIL:
      return {
        ...state,
        welcome_message: null,
      };
    case IMAGE_UPLOADED_SUCCESS:
      return {
        ...state,
        image_uploaded: payload,
      };
    case IMAGE_UPLOADED_FAIL:
      return {
        ...state,
        image_uploaded: payload,
      };
    case VIDEO_UPLOADED_SUCCESS:
      return {
        ...state,
        video_uploaded: payload,
      };
    case VIDEO_UPLOADED_FAIL:
      return {
        ...state,
        video_uploaded: payload,
      };
    case PERCENTAGE_SALES_VIDEO_UPLOAD:
      return {
        ...state,
        percentage_video: payload,
      };
    case PERCENTAGE_THUMBNAIL_UPLOAD:
      return {
        ...state,
        percentage_image: payload,
      };

    case ONCHANGE_PRODUCT_TITLE_SUCCESS:
      return {
        ...state,
        title: payload,
      };
    case ONCHANGE_PRODUCT_TITLE_FAIL:
      return {
        ...state,
        title: '',
      };
    case ONCHANGE_PRODUCT_SUB_TITLE_SUCCESS:
      return {
        ...state,
        sub_title: payload,
      };
    case ONCHANGE_PRODUCT_SUB_TITLE_FAIL:
      return {
        ...state,
        sub_title: '',
      };
    case ONCHANGE_PRODUCT_DESCRIPTION_SUCCESS:
      return {
        ...state,
        description: payload,
      };
    case ONCHANGE_PRODUCT_DESCRIPTION_FAIL:
      return {
        ...state,
        description: '',
      };
    case ONCHANGE_PRODUCT_LANGUAGE_SUCCESS:
      return {
        ...state,
        language: payload,
      };
    case ONCHANGE_PRODUCT_LANGUAGE_FAIL:
      return {
        ...state,
        language: '',
      };
    case ONCHANGE_PRODUCT_LEVEL_SUCCESS:
      return {
        ...state,
        level: payload,
      };
    case ONCHANGE_PRODUCT_LEVEL_FAIL:
      return {
        ...state,
        level: '',
      };
    case ONCHANGE_PRODUCT_CATEGORY_SUCCESS:
      return {
        ...state,
        category: payload,
      };
    case ONCHANGE_PRODUCT_CATEGORY_FAIL:
      return {
        ...state,
        category: '',
      };
    case ONCHANGE_PRODUCT_STOCK_SUCCESS:
      return {
        ...state,
        stock: payload,
      };
    case ONCHANGE_PRODUCT_STOCK_FAIL:
      return {
        ...state,
        stock: '',
      };
    case ONCHANGE_PRODUCT_IMAGE_SUCCESS:
      return {
        ...state,
        image: payload,
      };
    case ONCHANGE_PRODUCT_IMAGE_FAIL:
      return {
        ...state,
        image: '',
      };
    case ONCHANGE_PRODUCT_IMAGE_FILENAME_SUCCESS:
      return {
        ...state,
        image_filename: payload,
      };
    case ONCHANGE_PRODUCT_IMAGE_FILENAME_FAIL:
      return {
        ...state,
        image_filename: '',
      };
    case ONCHANGE_PRODUCT_VIDEO_SUCCESS:
      return {
        ...state,
        video: payload,
      };
    case ONCHANGE_PRODUCT_VIDEO_FAIL:
      return {
        ...state,
        video: '',
      };
    case ONCHANGE_PRODUCT_VIDEO_FILENAME_SUCCESS:
      return {
        ...state,
        video_filename: payload,
      };
    case ONCHANGE_PRODUCT_VIDEO_FILENAME_FAIL:
      return {
        ...state,
        video_filename: '',
      };

    default:
      return state;
  }
}
