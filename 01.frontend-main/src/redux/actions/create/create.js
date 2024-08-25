import axios from 'axios';
import {
  CREATE_COURSE_STEP_1_SUCCESS,
  CREATE_COURSE_STEP_2_SUCCESS,
  CREATE_COURSE_STEP_3_SUCCESS,
  CREATE_COURSE_STEP_4_SUCCESS,
  CREATE_COURSE_FAIL,
  NEW_COURSE_UUID,
  COURSE_LANDING_PAGE_SUCCESS,
  COURSE_LANDING_PAGE_FAIL,
  EDIT_GOALS_WHATLEARNT_FAIL,
  ONCHANGE_GOALS_REQUIREMENTS_FAIL,
  ONCHANGE_GOALS_WHOISFOR_FAIL,
  COURSE_INTENDED_LEARNERS_SUCCESS,
  COURSE_INTENDED_LEARNERS_FAIL,
  READ_STRUCTURE_SUCCESS,
  READ_STRUCTURE_FAIL,
  COURSE_STRUCTURE_SUCCESS,
  COURSE_STRUCTURE_FAIL,
  READ_SETUP_SUCCESS,
  READ_SETUP_FAIL,
  READ_FILM_FAIL,
  READ_FILM_SUCCESS,
  DISMISS_CURRICULUM_ALERT_SUCCESS,
  DISMISS_CURRICULUM_ALERT_FAIL,
  ONCHANGE_CONGRATS_MESSAGE_FAIL,
  ONCHANGE_WELCOME_MESSAGE_FAIL,
  ONCHANGE_CONGRATS_MESSAGE_SUCCESS,
  ONCHANGE_WELCOME_MESSAGE_SUCCESS,
  ONCHANGE_CURRICULUM_EPISODE_SUCCESS,
  ONCHANGE_CURRICULUM_FAIL,
  ONCHANGE_CURRICULUM_SUCCESS,
  ONCHANGE_CURRICULUM_EPISODE_FAIL,
  COURSE_ACCESSIBILITY_FAIL,
  CREATE_COURSE_SUCCESS,
  COURSE_CURRICULUM_BOOL_SUCCESS,
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
  ONCHANGE_COURSE_SUBCATEGORY_SUCCESS,
  ONCHANGE_COURSE_SUBCATEGORY_FAIL,
  ONCHANGE_COURSE_TAUGHT_SUCCESS,
  ONCHANGE_COURSE_TAUGHT_FAIL,
  ONCHANGE_COURSE_IMAGE_SUCCESS,
  ONCHANGE_COURSE_IMAGE_FILENAME_SUCCESS,
  ONCHANGE_COURSE_IMAGE_FAIL,
  ONCHANGE_COURSE_IMAGE_FILENAME_FAIL,
  ONCHANGE_COURSE_VIDEO_SUCCESS,
  ONCHANGE_COURSE_VIDEO_FILENAME_SUCCESS,
  ONCHANGE_COURSE_VIDEO_FAIL,
  ONCHANGE_COURSE_VIDEO_FILENAME_FAIL,
  PERCENTAGE_SALES_VIDEO_UPLOAD,
  PERCENTAGE_THUMBNAIL_UPLOAD,
  IMAGE_UPLOADED_SUCCESS,
  IMAGE_UPLOADED_FAIL,
  VIDEO_UPLOADED_SUCCESS,
  VIDEO_UPLOADED_FAIL,
  CREATE_PRODUCT_STEP_1_SUCCESS,
  CREATE_PRODUCT_STEP_1_FAIL,
  CREATE_PRODUCT_STEP_2_SUCCESS,
  CREATE_PRODUCT_STEP_2_FAIL,
  CREATE_PRODUCT_STEP_3_SUCCESS,
  CREATE_PRODUCT_STEP_3_FAIL,
  CREATE_PRODUCT_STEP_4_SUCCESS,
  CREATE_PRODUCT_STEP_4_FAIL,
  CREATE_COURSE_STEP_3_SECONDARY_SUCCESS,
  CREATE_COURSE_STEP_3_TERTIARY_SUCCESS,
  CREATE_PRODUCT_STEP_3_SECONDARY_SUCCESS,
  // CREATE_PRODUCT_STEP_3_SECONDARY_FAIL,
  CREATE_PRODUCT_STEP_3_TERTIARY_SUCCESS,
  // CREATE_PRODUCT_STEP_3_TERTIARY_FAIL,
  // CREATE_COURSE_STEP_3_SECONDARY_FAIL,
  // CREATE_COURSE_STEP_3_TERTIARY_FAIL,
  // CREATE_PRODUCT_SUCCESS,
  // CREATE_PRODUCT_FAIL,
  NEW_PRODUCT_UUID,
  CREATE_PRODUCT_SUCCESS,
} from './types';

// GET COURSES
export const setCourseStep1 = (type) => async (dispatch) => {
  dispatch({
    type: CREATE_COURSE_STEP_1_SUCCESS,
    payload: type,
  });
};

export const setCourseStep2 = (title) => async (dispatch) => {
  dispatch({
    type: CREATE_COURSE_STEP_2_SUCCESS,
    payload: title,
  });
};

export const setCourseStep3 = (category) => async (dispatch) => {
  dispatch({
    type: CREATE_COURSE_STEP_3_SUCCESS,
    payload: category,
  });
};
export const setCourseStep3Secondary = (category) => async (dispatch) => {
  dispatch({
    type: CREATE_COURSE_STEP_3_SECONDARY_SUCCESS,
    payload: category,
  });
};
export const setCourseStep3Tertiary = (category) => async (dispatch) => {
  dispatch({
    type: CREATE_COURSE_STEP_3_TERTIARY_SUCCESS,
    payload: category,
  });
};

export const setCourseStep4 = (dedication) => async (dispatch) => {
  dispatch({
    type: CREATE_COURSE_STEP_4_SUCCESS,
    payload: dedication,
  });
};

export const newCourseUUID = (courseUUID) => async (dispatch) => {
  dispatch({
    type: NEW_COURSE_UUID,
    payload: courseUUID,
  });
};

export const createCourse =
  (type, title, category, subCategory, topic, dedication, user, ethAddress, polygonAddress) =>
  async (dispatch) => {
    try {
      const body = JSON.stringify({
        type,
        title,
        category,
        subCategory,
        topic,
        dedication,
        user,
        ethAddress,
        polygonAddress,
      });

      const res = await fetch('/api/sell/courses/create', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await res.json();
      if (data.status === 201) {
        await dispatch({
          type: CREATE_COURSE_SUCCESS,
          payload: data.results[0],
        });
      }
    } catch (err) {
      dispatch({
        type: CREATE_COURSE_FAIL,
      });
    }
  };

export const createCourseFail = () => async (dispatch) => {
  await dispatch({
    type: CREATE_COURSE_FAIL,
  });
};

export const setCourseLandingPage = (courseUUID, landingPage) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      courseUUID,
      landingPage,
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/landing_page/${body.courseUUID}`,
      body,
      config,
    );

    const data = await res.json();
    if (data.details) {
      await dispatch({
        type: COURSE_LANDING_PAGE_SUCCESS,
        payload: true,
      });
    } else {
      dispatch({
        type: COURSE_LANDING_PAGE_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: COURSE_LANDING_PAGE_FAIL,
    });
  }
};

export const resetCourseWhatlearnt = () => async (dispatch) => {
  dispatch({
    type: EDIT_GOALS_WHATLEARNT_FAIL,
  });
};

export const resetCourseRequisites = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_GOALS_REQUIREMENTS_FAIL,
  });
};

export const resetCourseWhoIsFor = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_GOALS_WHOISFOR_FAIL,
  });
};

export const setCourseGoals = (courseUUID, setGoal) => async (dispatch) => {
  try {
    const access = localStorage.getItem('access');

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      setGoal,
    });

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/goals/`,
      body,
      config,
    );

    const data = await res.json();

    if (data.details) {
      await dispatch({
        type: COURSE_INTENDED_LEARNERS_SUCCESS,
        payload: true,
      });
    } else {
      dispatch({
        type: COURSE_INTENDED_LEARNERS_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: COURSE_INTENDED_LEARNERS_FAIL,
    });
  }
};

export const setCourseStructure = (courseUUID, setStructure) => async (dispatch) => {
  try {
    const access = localStorage.getItem('access');

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      setStructure,
    });

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/structure/`,
      body,
      config,
    );

    const data = await res.json();

    if (data.details) {
      await dispatch({
        type: COURSE_STRUCTURE_SUCCESS,
        payload: true,
      });
    } else {
      dispatch({
        type: COURSE_STRUCTURE_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: COURSE_STRUCTURE_FAIL,
    });
  }
};

export const readCourseStructure = () => async (dispatch) => {
  dispatch({
    type: READ_STRUCTURE_SUCCESS,
  });
};

export const resetCourseStructure = () => async (dispatch) => {
  dispatch({
    type: READ_STRUCTURE_FAIL,
  });
};

export const readCourseSetup = () => async (dispatch) => {
  dispatch({
    type: READ_SETUP_SUCCESS,
  });
};

export const resetCourseSetup = () => async (dispatch) => {
  dispatch({
    type: READ_SETUP_FAIL,
  });
};

export const setCourseSetup = (courseUUID, setSetup) => async (dispatch) => {
  try {
    const access = localStorage.getItem('access');

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      setSetup,
    });

    await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/setup/`,
      body,
      config,
    );
  } catch (err) {
    dispatch({
      type: COURSE_STRUCTURE_FAIL,
    });
  }
};

export const readCourseFilm = () => async (dispatch) => {
  dispatch({
    type: READ_FILM_SUCCESS,
  });
};

export const resetCourseFilm = () => async (dispatch) => {
  dispatch({
    type: READ_FILM_FAIL,
  });
};

export const setCourseFilm = (courseUUID, setFilm) => async (dispatch) => {
  try {
    const access = localStorage.getItem('access');

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      setFilm,
    });

    await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/film/`,
      body,
      config,
    );
  } catch (err) {
    dispatch({
      type: COURSE_STRUCTURE_FAIL,
    });
  }
};

export const dismissCurriculumAlert = () => async (dispatch) => {
  dispatch({
    type: DISMISS_CURRICULUM_ALERT_SUCCESS,
  });
};

export const resetCurriculumAlert = () => async (dispatch) => {
  dispatch({
    type: DISMISS_CURRICULUM_ALERT_FAIL,
  });
};

export const onchangeCourseWelcomeMessage = (message) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_WELCOME_MESSAGE_SUCCESS,
    payload: message,
  });
};

export const onchangeCourseCongratsMessage = (message) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_CONGRATS_MESSAGE_SUCCESS,
    payload: message,
  });
};

export const resetCourseWelcomeMessage = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_WELCOME_MESSAGE_FAIL,
  });
};

export const resetCourseCongratsMessage = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_CONGRATS_MESSAGE_FAIL,
  });
};

export const onchangeCourseCurriculum = (list) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_CURRICULUM_SUCCESS,
    payload: list,
  });
};
export const resetCourseCurriculum = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_CURRICULUM_FAIL,
  });
};

export const onchangeCourseCurriculumEpisode = (episode) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_CURRICULUM_EPISODE_SUCCESS,
    payload: episode,
  });
};
export const resetCourseCurriculumEpisode = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_CURRICULUM_EPISODE_FAIL,
  });
};

export const setCourseCurriculum = (courseUUID, setCurriculum) => async (dispatch) => {
  try {
    const access = localStorage.getItem('access');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      setCurriculum,
    });

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/curriculum/`,
      body,
      config,
    );

    if (res.status === 200) {
      await dispatch({
        type: COURSE_CURRICULUM_BOOL_SUCCESS,
        payload: true,
      });
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log('error');
  }
};

export const setCourseAccessibility = (courseUUID, setAccessibility) => async (dispatch) => {
  try {
    const access = localStorage.getItem('access');

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    };

    const body = JSON.stringify({
      courseUUID,
      setAccessibility,
    });

    await axios.put(
      `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/edit/accessibility/`,
      body,
      config,
    );
  } catch (err) {
    dispatch({
      type: COURSE_ACCESSIBILITY_FAIL,
    });
  }
};

export const onchangeCourseTitle = (title) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_TITLE_SUCCESS,
    payload: title,
  });
};
export const resetCourseTitle = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_TITLE_FAIL,
  });
};

export const onchangeCourseSubTitle = (subTitle) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_SUB_TITLE_SUCCESS,
    payload: subTitle,
  });
};
export const resetCourseSubTitle = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_SUB_TITLE_FAIL,
  });
};

export const onchangeCourseDescription = (description) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_DESCRIPTION_SUCCESS,
    payload: description,
  });
};
export const resetCourseDescription = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_DESCRIPTION_FAIL,
  });
};

export const onchangeCourseLanguage = (language) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_LANGUAGE_SUCCESS,
    payload: language,
  });
};
export const resetCourseLanguage = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_LANGUAGE_FAIL,
  });
};

export const onchangeCourseLevel = (level) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_LEVEL_SUCCESS,
    payload: level,
  });
};
export const resetCourseLevel = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_LEVEL_FAIL,
  });
};

export const onchangeCourseCategory = (category) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_CATEGORY_SUCCESS,
    payload: category,
  });
};
export const resetCourseCategory = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_CATEGORY_FAIL,
  });
};
export const onchangeCourseSubCategory = (category) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_SUBCATEGORY_SUCCESS,
    payload: category,
  });
};
export const resetCourseSubCategory = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_SUBCATEGORY_FAIL,
  });
};

export const onchangeCourseTaught = (taught) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_TAUGHT_SUCCESS,
    payload: taught,
  });
};
export const resetCourseTaught = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_TAUGHT_FAIL,
  });
};

export const onchangeCourseImage = (image) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_IMAGE_SUCCESS,
    payload: image,
  });
};
export const onchangeCourseImageFilename = (filename) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_IMAGE_FILENAME_SUCCESS,
    payload: filename,
  });
};
export const resetCourseImage = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_IMAGE_FAIL,
  });
  dispatch({
    type: ONCHANGE_COURSE_IMAGE_FILENAME_FAIL,
  });
};

export const onchangeCourseVideo = (video, filename) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_VIDEO_SUCCESS,
    payload: video,
  });
  dispatch({
    type: ONCHANGE_COURSE_VIDEO_FILENAME_SUCCESS,
    payload: filename,
  });
};

export const onchangeCourseVideoFilename = (filename) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_VIDEO_FILENAME_SUCCESS,
    payload: filename,
  });
};
export const resetCourseVideo = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_COURSE_VIDEO_FAIL,
  });
  dispatch({
    type: ONCHANGE_COURSE_VIDEO_FILENAME_FAIL,
  });
};

export const setVideoPercentageUpload = (percentage) => async (dispatch) => {
  dispatch({
    type: PERCENTAGE_SALES_VIDEO_UPLOAD,
    payload: percentage,
  });
};

export const setImagePercentageUpload = (percentage) => async (dispatch) => {
  dispatch({
    type: PERCENTAGE_THUMBNAIL_UPLOAD,
    payload: percentage,
  });
};

export const setImageUploaded = () => async (dispatch) => {
  dispatch({
    type: IMAGE_UPLOADED_SUCCESS,
    payload: true,
  });
};
export const resetImageUploaded = () => async (dispatch) => {
  dispatch({
    type: IMAGE_UPLOADED_FAIL,
    payload: false,
  });
};

export const setVideoUploaded = () => async (dispatch) => {
  dispatch({
    type: VIDEO_UPLOADED_SUCCESS,
    payload: true,
  });
};
export const resetVideoUploaded = () => async (dispatch) => {
  dispatch({
    type: VIDEO_UPLOADED_FAIL,
    payload: false,
  });
};

export const setProductStep1 = (type) => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_1_SUCCESS,
    payload: type,
  });
};

export const setProductStep2 = (title) => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_2_SUCCESS,
    payload: title,
  });
};

export const setProductStep3 = (category) => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_3_SUCCESS,
    payload: category,
  });
};

export const setProductStep3Secondary = (category) => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_3_SECONDARY_SUCCESS,
    payload: category,
  });
};
export const setProductStep3Tertiary = (category) => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_3_TERTIARY_SUCCESS,
    payload: category,
  });
};

export const setProductStep4 = (dedication) => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_4_SUCCESS,
    payload: dedication,
  });
};

export const resetProductStep1 = () => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_1_FAIL,
  });
};

export const resetProductStep2 = () => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_2_FAIL,
  });
};

export const resetProductStep3 = () => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_3_FAIL,
  });
};

export const resetProductStep4 = () => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_STEP_4_FAIL,
  });
};

export const productCreateSucccess = () => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_SUCCESS,
  });
};

export const newProductUUID = (productUUID) => async (dispatch) => {
  dispatch({
    type: NEW_PRODUCT_UUID,
    payload: productUUID,
  });
};
