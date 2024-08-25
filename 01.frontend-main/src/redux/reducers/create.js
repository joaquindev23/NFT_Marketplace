import {
  CREATE_COURSE_STEP_1_SUCCESS,
  CREATE_COURSE_STEP_1_FAIL,
  CREATE_COURSE_STEP_2_SUCCESS,
  CREATE_COURSE_STEP_2_FAIL,
  CREATE_COURSE_STEP_3_SUCCESS,
  CREATE_COURSE_STEP_3_FAIL,
  CREATE_COURSE_STEP_4_SUCCESS,
  CREATE_COURSE_STEP_4_FAIL,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
  EDIT_GOALS_WHATLEARNT_SUCCESS,
  EDIT_GOALS_WHATLEARNT_FAIL,
  ONCHANGE_GOALS_WHATLEARNT_SUCCESS,
  ONCHANGE_GOALS_WHATLEARNT_FAIL,
  EDIT_GOALS_REQUIREMENTS_SUCCESS,
  EDIT_GOALS_REQUIREMENTS_FAIL,
  ONCHANGE_GOALS_REQUIREMENTS_SUCCESS,
  ONCHANGE_GOALS_REQUIREMENTS_FAIL,
  EDIT_GOALS_WHOISFOR_SUCCESS,
  EDIT_GOALS_WHOISFOR_FAIL,
  ONCHANGE_GOALS_WHOISFOR_SUCCESS,
  ONCHANGE_GOALS_WHOISFOR_FAIL,
  READ_STRUCTURE_SUCCESS,
  READ_STRUCTURE_FAIL,
  READ_SETUP_SUCCESS,
  READ_SETUP_FAIL,
  READ_FILM_SUCCESS,
  READ_FILM_FAIL,
  DISMISS_CURRICULUM_ALERT_SUCCESS,
  DISMISS_CURRICULUM_ALERT_FAIL,
  ONCHANGE_CURRICULUM_SUCCESS,
  ONCHANGE_CURRICULUM_FAIL,
  ONCHANGE_CURRICULUM_EPISODE_SUCCESS,
  ONCHANGE_CURRICULUM_EPISODE_FAIL,
  NEW_COURSE_UUID,
  ONCHANGE_COURSE_TITLE_SUCCESS,
  ONCHANGE_COURSE_TITLE_FAIL,
  ONCHANGE_COURSE_SUB_TITLE_SUCCESS,
  ONCHANGE_COURSE_SUB_TITLE_FAIL,
  ONCHANGE_COURSE_DESCRIPTION_SUCCESS,
  ONCHANGE_COURSE_DESCRIPTION_FAIL,
  ONCHANGE_COURSE_LANGUAGE_SUCCESS,
  ONCHANGE_COURSE_LANGUAGE_FAIL,
  ONCHANGE_COURSE_LEVEL_SUCCESS,
  ONCHANGE_COURSE_LEVEL_FAIL,
  ONCHANGE_COURSE_CATEGORY_SUCCESS,
  ONCHANGE_COURSE_CATEGORY_FAIL,
  // ONCHANGE_COURSE_SUBCATEGORY_SUCCESS,
  // ONCHANGE_COURSE_SUBCATEGORY_FAIL,
  CREATE_COURSE_STEP_3_SECONDARY_SUCCESS,
  CREATE_COURSE_STEP_3_TERTIARY_SUCCESS,
  ONCHANGE_COURSE_TAUGHT_SUCCESS,
  ONCHANGE_COURSE_TAUGHT_FAIL,
  ONCHANGE_COURSE_IMAGE_SUCCESS,
  ONCHANGE_COURSE_IMAGE_FAIL,
  ONCHANGE_COURSE_VIDEO_SUCCESS,
  ONCHANGE_COURSE_VIDEO_FAIL,
  ONCHANGE_COURSE_IMAGE_FILENAME_SUCCESS,
  ONCHANGE_COURSE_IMAGE_FILENAME_FAIL,
  ONCHANGE_COURSE_VIDEO_FILENAME_SUCCESS,
  ONCHANGE_COURSE_VIDEO_FILENAME_FAIL,
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
  CREATE_PRODUCT_STEP_1_SUCCESS,
  CREATE_PRODUCT_STEP_2_SUCCESS,
  CREATE_PRODUCT_STEP_3_SUCCESS,
  CREATE_PRODUCT_STEP_4_SUCCESS,
  // NEW_PRODUCT_UUID,
  CREATE_PRODUCT_STEP_1_FAIL,
  CREATE_PRODUCT_STEP_2_FAIL,
  CREATE_PRODUCT_STEP_3_FAIL,
  CREATE_PRODUCT_STEP_4_FAIL,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAIL,
  CREATE_COURSE_STEP_3_TERTIARY_FAIL,
  CREATE_COURSE_STEP_3_SECONDARY_FAIL,
  CREATE_PRODUCT_STEP_3_SECONDARY_SUCCESS,
  CREATE_PRODUCT_STEP_3_TERTIARY_SUCCESS,
} from '../actions/create/types';

const initialState = {
  type: null,
  course_uuid: null,
  title: null,
  category: null,
  categorySecondary: null,
  categoryTertiary: null,
  dedication: null,
  courseUUID: null,
  product_type: null,
  product_productUUID: null,
  product_category: null,
  product_categorySecondary: null,
  product_categoryTertiary: null,
  product_title: null,
  product_dedication: null,
  business_activity: null,
  course_created: false,
  product_created: false,
  whatlearnt: [
    { id: 0, title: '' },
    { id: 1, title: '' },
    { id: 2, title: '' },
    { id: 3, title: '' },
  ],
  requisites: [{ id: 0, title: '' }],
  who_is_for: [{ id: 0, title: '' }],
  read_course_structure: false,
  read_course_setup: false,
  read_course_film: false,
  curriculum_alert: true,
  sections: [
    {
      id: 0,
      section_title: 'Introduction',
      learning_objective: 'Enter a learning objective',
      section_number: 1,
      episodes: [],
      section_uuid: 'ec9fb09e-183e-4077-877c-e411706bfdcc',
      published: true,
    },
  ],
  episodes: [
    {
      id: 0,
      episode_number: 1,
      title: 'Introduction',
      file: null,
      filename: '',
      date: null,
      resources: [],
      content: '',
      description: '',
      section_uuid: 'ec9fb09e-183e-4077-877c-e411706bfdcc',
      episode_uuid: '0efa2889-d320-4fa8-a8ff-55d371620755',
      published: false,
      length: 0,
      // comments:[]
    },
  ],
  resources: [],
  curriculum_ready: false,
  sub_title: '',
  description: '',
  language: '',
  level: '',
  taught: '',
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

// eslint-next-disable default-param-last
export default function create(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PRODUCT_STEP_1_SUCCESS:
      return {
        ...state,
        product_type: payload,
      };
    case CREATE_PRODUCT_STEP_1_FAIL:
      return {
        ...state,
        product_type: null,
      };
    case CREATE_PRODUCT_STEP_2_SUCCESS:
      return {
        ...state,
        product_title: payload,
      };
    case CREATE_PRODUCT_STEP_2_FAIL:
      return {
        ...state,
        product_title: null,
      };
    case CREATE_PRODUCT_STEP_3_SUCCESS:
      return {
        ...state,
        product_category: payload,
      };
    case CREATE_PRODUCT_STEP_3_FAIL:
      return {
        ...state,
        product_category: null,
      };
    case CREATE_PRODUCT_STEP_4_SUCCESS:
      // eslint-disable-next-line
      return {
        ...state,
        business_activity: payload,
      };
    case CREATE_PRODUCT_STEP_4_FAIL:
      return {
        ...state,
        business_activity: null,
      };
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        product_created: true,
        // productUUID: payload.course_uuid,
        product_title: null,
        product_category: null,
        business_activity: null,
        product_type: null,
      };
    case CREATE_PRODUCT_FAIL:
      return {
        ...state,
        // productUUID: null,
        product_created: false,
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
    case NEW_COURSE_UUID:
      return {
        ...state,
        course_uuid: payload,
      };
    case ONCHANGE_CURRICULUM_SUCCESS:
      return {
        ...state,
        sections: payload,
      };
    case ONCHANGE_CURRICULUM_FAIL:
      return {
        ...state,
        sections: [
          {
            id: 0,
            section_title: 'Introduction',
            learning_objective: 'Enter a learning objective',
            section_number: 1,
            episodes: [],
            section_uuid: 'ec9fb09e-183e-4077-877c-e411706bfdcc',
            published: true,
          },
        ],
      };
    case ONCHANGE_CURRICULUM_EPISODE_SUCCESS:
      return {
        ...state,
        episodes: payload,
      };
    case ONCHANGE_CURRICULUM_EPISODE_FAIL:
      return {
        ...state,
        episodes: [
          {
            id: 0,
            episode_number: 1,
            title: 'Introduction',
            file: null,
            filename: '',
            date: null,
            resources: [],
            content: '',
            description: '',
            section_uuid: 'ec9fb09e-183e-4077-877c-e411706bfdcc',
            episode_uuid: '0efa2889-d320-4fa8-a8ff-55d371620755',
            published: false,
            length: 0,
            // comments:[]
          },
        ],
      };
    case DISMISS_CURRICULUM_ALERT_SUCCESS:
      return {
        ...state,
        curriculum_alert: false,
      };
    case DISMISS_CURRICULUM_ALERT_FAIL:
      return {
        ...state,
        curriculum_alert: true,
      };
    case READ_FILM_SUCCESS:
      return {
        ...state,
        read_course_film: true,
      };
    case READ_FILM_FAIL:
      return {
        ...state,
        read_course_film: false,
      };
    case READ_SETUP_SUCCESS:
      return {
        ...state,
        read_course_setup: true,
      };
    case READ_SETUP_FAIL:
      return {
        ...state,
        read_course_setup: false,
      };
    case READ_STRUCTURE_SUCCESS:
      return {
        ...state,
        read_course_structure: true,
      };
    case READ_STRUCTURE_FAIL:
      return {
        ...state,
        read_course_structure: false,
      };
    case ONCHANGE_GOALS_WHOISFOR_SUCCESS:
      return {
        ...state,
        who_is_for: payload,
      };
    case ONCHANGE_GOALS_WHOISFOR_FAIL:
      return {
        ...state,
        who_is_for: [{ id: 0, title: '' }],
      };
    case ONCHANGE_COURSE_TITLE_SUCCESS:
      return {
        ...state,
        title: payload,
      };
    case ONCHANGE_COURSE_TITLE_FAIL:
      return {
        ...state,
        title: '',
      };
    case ONCHANGE_COURSE_SUB_TITLE_SUCCESS:
      return {
        ...state,
        sub_title: payload,
      };
    case ONCHANGE_COURSE_SUB_TITLE_FAIL:
      return {
        ...state,
        sub_title: '',
      };
    case ONCHANGE_COURSE_DESCRIPTION_SUCCESS:
      return {
        ...state,
        description: payload,
      };
    case ONCHANGE_COURSE_DESCRIPTION_FAIL:
      return {
        ...state,
        description: '',
      };
    case ONCHANGE_COURSE_LANGUAGE_SUCCESS:
      return {
        ...state,
        language: payload,
      };
    case ONCHANGE_COURSE_LANGUAGE_FAIL:
      return {
        ...state,
        language: '',
      };
    case ONCHANGE_COURSE_LEVEL_SUCCESS:
      return {
        ...state,
        level: payload,
      };
    case ONCHANGE_COURSE_LEVEL_FAIL:
      return {
        ...state,
        level: '',
      };
    case ONCHANGE_COURSE_CATEGORY_SUCCESS:
      return {
        ...state,
        category: payload,
      };
    case ONCHANGE_COURSE_CATEGORY_FAIL:
      return {
        ...state,
        category: '',
      };
    case ONCHANGE_COURSE_TAUGHT_SUCCESS:
      return {
        ...state,
        taught: payload,
      };
    case ONCHANGE_COURSE_TAUGHT_FAIL:
      return {
        ...state,
        taught: '',
      };
    case ONCHANGE_COURSE_IMAGE_SUCCESS:
      return {
        ...state,
        image: payload,
      };
    case ONCHANGE_COURSE_IMAGE_FAIL:
      return {
        ...state,
        image: '',
      };
    case ONCHANGE_COURSE_IMAGE_FILENAME_SUCCESS:
      return {
        ...state,
        image_filename: payload,
      };
    case ONCHANGE_COURSE_IMAGE_FILENAME_FAIL:
      return {
        ...state,
        image_filename: '',
      };
    case ONCHANGE_COURSE_VIDEO_SUCCESS:
      return {
        ...state,
        video: payload,
      };
    case ONCHANGE_COURSE_VIDEO_FAIL:
      return {
        ...state,
        video: '',
      };
    case ONCHANGE_COURSE_VIDEO_FILENAME_SUCCESS:
      return {
        ...state,
        video_filename: payload,
      };
    case ONCHANGE_COURSE_VIDEO_FILENAME_FAIL:
      return {
        ...state,
        video_filename: '',
      };
    case ONCHANGE_GOALS_WHATLEARNT_SUCCESS:
      return {
        ...state,
        whatlearnt: payload,
      };
    case ONCHANGE_GOALS_WHATLEARNT_FAIL:
      return {
        ...state,
        whatlearnt: [
          { id: 0, title: '' },
          { id: 1, title: '' },
          { id: 2, title: '' },
          { id: 3, title: '' },
        ],
      };
    case ONCHANGE_GOALS_REQUIREMENTS_SUCCESS:
      return {
        ...state,
        requisites: payload,
      };
    case ONCHANGE_GOALS_REQUIREMENTS_FAIL:
      return {
        ...state,
        requisites: [{ id: 0, title: '' }],
      };
    case EDIT_GOALS_WHATLEARNT_SUCCESS:
      return {
        ...state,
        whatlearnt: [
          { id: 0, title: '' },
          { id: 1, title: '' },
          { id: 2, title: '' },
          { id: 3, title: '' },
        ],
      };
    case EDIT_GOALS_WHOISFOR_SUCCESS:
      return {
        ...state,
        who_is_for: [{ id: 0, title: '' }],
      };
    case EDIT_GOALS_REQUIREMENTS_SUCCESS:
      return {
        ...state,
        requisites: [{ id: 0, title: '' }],
      };
    case EDIT_GOALS_WHATLEARNT_FAIL:
      return {
        ...state,
        whatlearnt: [
          { id: 0, title: '' },
          { id: 1, title: '' },
          { id: 2, title: '' },
          { id: 3, title: '' },
        ],
      };
    case EDIT_GOALS_REQUIREMENTS_FAIL:
      return {
        ...state,
        requisites: [{ id: 0, title: '' }],
      };
    case EDIT_GOALS_WHOISFOR_FAIL:
      return {
        ...state,
        who_is_for: [{ id: 0, title: '' }],
      };

    case CREATE_COURSE_STEP_1_SUCCESS:
      return {
        ...state,
        type: payload,
      };
    case CREATE_COURSE_STEP_1_FAIL:
      return {
        ...state,
        type: null,
      };
    case CREATE_COURSE_STEP_2_SUCCESS:
      return {
        ...state,
        title: payload,
      };
    case CREATE_COURSE_STEP_2_FAIL:
      return {
        ...state,
        title: null,
      };
    case CREATE_COURSE_STEP_3_TERTIARY_SUCCESS:
      return {
        ...state,
        categoryTertiary: payload,
      };
    case CREATE_COURSE_STEP_3_TERTIARY_FAIL:
      return {
        ...state,
        categoryTertiary: null,
      };
    case CREATE_COURSE_STEP_3_SECONDARY_SUCCESS:
      return {
        ...state,
        categorySecondary: payload,
      };
    case CREATE_PRODUCT_STEP_3_SECONDARY_SUCCESS:
      return {
        ...state,
        product_categorySecondary: null,
      };
    case CREATE_PRODUCT_STEP_3_TERTIARY_SUCCESS:
      return {
        ...state,
        product_categoryTertiary: payload,
      };
    case CREATE_COURSE_STEP_3_SECONDARY_FAIL:
      return {
        ...state,
        categorySecondary: null,
      };
    case CREATE_COURSE_STEP_3_SUCCESS:
      return {
        ...state,
        category: payload,
      };
    case CREATE_COURSE_STEP_3_FAIL:
      return {
        ...state,
        category: null,
      };
    case CREATE_COURSE_STEP_4_SUCCESS:
      return {
        ...state,
        dedication: payload,
      };
    case CREATE_COURSE_STEP_4_FAIL:
      return {
        ...state,
        dedication: null,
      };
    case CREATE_COURSE_SUCCESS:
      // eslint-disable-next-line
      return {
        ...state,
        course: payload[0],
        course_created: true,
        course_uuid: payload[0].id,
      };
    case CREATE_COURSE_FAIL:
      return {
        ...state,
        course: null,
        course_uuid: null,
        course_created: false,
        title: null,
        category: null,
        categorySecondary: null,
        categoryTertiary: null,
        dedication: null,
        type: null,
      };
    default:
      return state;
  }
}
