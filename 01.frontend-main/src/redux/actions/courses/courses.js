import axios from 'axios';
import { ToastError } from '../../../components/toast/ToastError';
import { ToastSuccess } from '../../../components/ToastSuccess';

import {
  ADD_IMAGE,
  ADD_VIDEO,
  REMOVE_IMAGE,
  REMOVE_VIDEO,
  UPDATE_DRAGGABLES_IMAGE,
  UPDATE_DRAGGABLES_VIDEO,
  GET_COURSE_SUCCESS,
  GET_COURSE_FAIL,
  ADD_WHATLEARNT,
  REMOVE_WHATLEARNT,
  ON_CHANGE_COURSE_WHATLEARNT,
  ON_CHANGE_COURSE_REQUISITE,
  REMOVE_REQUISITE,
  ADD_REQUISITE,
  ADD_WHOISFOR,
  REMOVE_WHOISFOR,
  ON_CHANGE_COURSE_WHOISFOR,
  ON_CHANGE_COURSE_TITLE,
  ON_CHANGE_COURSE_SUB_TITLE,
  ON_CHANGE_COURSE_LANGUAGE,
  ON_CHANGE_COURSE_LEVEL,
  ON_CHANGE_COURSE_CATEGORY,
  ON_CHANGE_COURSE_DESCRIPTION,
  ON_CHANGE_COURSE_TAUGHT,
  ON_CHANGE_COURSE_VIDEO,
  ON_CHANGE_COURSE_IMAGE,
  ON_CHANGE_COURSE_DISCOUNT_UNTIL,
  ON_CHANGE_COURSE_COMPARE_PRICE,
  ON_CHANGE_COURSE_PRICE,
  UPDATE_DRAGGABLES_REQUISITE,
  UPDATE_DRAGGABLES_WHATLEARNT,
  UPDATE_DRAGGABLES_WHOISFOR,
  RESET_CREATE_VARIABLES,
  DEPLOY_COURSE_SUCCESS,
  DEPLOY_COURSE_FAIL,
} from './types';
import fetchCourse from '@/api/manage/courses/fetchCourse';

export const getCourse = (courseUUID) => async (dispatch) => {
  try {
    const res = await fetchCourse(courseUUID);

    if (res && !res.error) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.results,
      });
    } else {
      dispatch({
        type: GET_COURSE_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_COURSE_FAIL,
    });
  }
};

export const resetCourse = () => async (dispatch) => {
  dispatch({
    type: GET_COURSE_FAIL,
  });
};

export const addWhatlearnt = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_WHATLEARNT,
    payload: newItem,
  });
};

export const removeWhatlearnt = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_WHATLEARNT,
    payload: index,
  });
};

export const onchangeCourseWhatlearnt = (whatlearntList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_WHATLEARNT,
    payload: whatlearntList,
  });
};

export const updateCourseWhatlearnt = (courseUUID, whatlearntList) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      whatlearntList,
    });

    const res = await fetch('/api/sell/courses/updateWhatlearnt', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: data.data,
      });
    } else {
      const error = await res.json();
      console.error(`Error: ${error.error}`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteCourseWhatlearnt = (courseUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      id,
    });

    const res = await fetch('/api/sell/courses/deleteWhatlearnt', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: data.data,
      });
    } else {
      const error = await res.json();
      console.error(`Error: ${error.error}`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const addRequisite = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_REQUISITE,
    payload: newItem,
  });
};

export const removeRequisite = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_REQUISITE,
    payload: index,
  });
};

export const onchangeCourseRequisite = (requisitesList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_REQUISITE,
    payload: requisitesList,
  });
};

export const updateCourseRequisite = (courseUUID, requisitesList) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      requisitesList,
    });

    const res = await fetch('/api/sell/courses/updateRequisites', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: data.data,
      });
    } else {
      const error = await res.json();
      console.error(`Error: ${error.error}`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteCourseRequisite = (courseUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      id,
    });

    const res = await fetch('/api/sell/courses/deleteRequisite', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: data.data,
      });
    } else {
      const error = await res.json();
      console.error(`Error: ${error.error}`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const addWhoIsFor = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_WHOISFOR,
    payload: newItem,
  });
};

export const removeWhoIsFor = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_WHOISFOR,
    payload: index,
  });
};

export const onchangeCourseWhoIsFor = (whoIsForList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_WHOISFOR,
    payload: whoIsForList,
  });
};

export const updateCourseWhoIsFor = (courseUUID, whoIsForList) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      whoIsForList,
    });

    const res = await fetch('/api/sell/courses/updateWhoisfor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: data.data,
      });
    } else {
      const error = await res.json();
      console.error(`Error: ${error.error}`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

export const deleteCourseWhoIsFor = (courseUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      id,
    });

    const res = await fetch('/api/sell/courses/deleteWhoisfor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: data.data,
      });
    } else {
      const error = await res.json();
      console.error(`Error: ${error.error}`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const onchangeCourseTitle = (title) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_TITLE,
    payload: title,
  });
};

export const onchangeCourseSubTitle = (subTitle) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_SUB_TITLE,
    payload: subTitle,
  });
};

export const onchangeCourseDescription = (description) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_DESCRIPTION,
    payload: description,
  });
};

export const onchangeCourseLanguage = (language) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_LANGUAGE,
    payload: language,
  });
};

export const onchangeCourseLevel = (level) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_LEVEL,
    payload: level,
  });
};

export const onchangeCourseTaught = (taught) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_TAUGHT,
    payload: taught,
  });
};

export const onchangeCourseCategory = (category) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_CATEGORY,
    payload: category,
  });
};

export const updateCourse = (courseUUID, courseBody) => async (dispatch) => {
  try {
    const body = {
      courseUUID,
      courseBody,
    };
    const res = await axios.put('/api/sell/courses/updateCourse', body);

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesImage = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_IMAGE,
    payload: newList,
  });
};

export const addImage = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_IMAGE,
    payload: newItem,
  });
};

export const removeImage = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_IMAGE,
    payload: index,
  });
};

export const onchangeCourseImage = (imagesList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_IMAGE,
    payload: imagesList,
  });
};

export const updateCourseImage = (courseUUID, imagesList) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('courseUUID', courseUUID);
    imagesList.forEach((image, index) => {
      formData.append(`imagesList[${index}].id`, image.id);
      formData.append(`imagesList[${index}].position_id`, image.position_id);
      formData.append(`imagesList[${index}].title`, image.title);
      formData.append(`imagesList[${index}].file`, image.file);
    });

    const res = await axios.post('/api/sell/courses/images/create', formData);

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteCourseImage = (courseUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      id,
    });

    const res = await axios.post('/api/sell/courses/images/delete', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesVideo = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_VIDEO,
    payload: newList,
  });
};

export const addVideo = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_VIDEO,
    payload: newItem,
  });
};

export const removeVideo = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_VIDEO,
    payload: index,
  });
};

export const onchangeCourseVideo = (videosList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_VIDEO,
    payload: videosList,
  });
};

export const updateCourseVideo = (courseUUID, videosList, onUploadProgress) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('courseUUID', courseUUID);
    videosList.forEach((video, index) => {
      formData.append(`videosList[${index}].id`, video.id);
      formData.append(`videosList[${index}].position_id`, video.position_id);
      formData.append(`videosList[${index}].title`, video.title);
      formData.append(`videosList[${index}].file`, video.file);
    });

    const res = await axios.post('/api/sell/courses/videos/create', formData, {
      onUploadProgress,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteCourseVideo = (courseUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      id,
    });

    const res = await axios.post('/api/sell/courses/videos/delete', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const onchangeCoursePrice = (price) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_PRICE,
    payload: price,
  });
};
export const onchangeCourseComparePrice = (price) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_COMPARE_PRICE,
    payload: price,
  });
};
export const onchangeCourseDiscountUntil = (discount) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_COURSE_DISCOUNT_UNTIL,
    payload: discount,
  });
};

export const updateCoursePricing = (courseUUID, courseBody) => async (dispatch) => {
  try {
    const body = {
      courseUUID,
      courseBody,
    };
    const res = await axios.put('/api/sell/courses/updatePricing', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
    return res;
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
    return null;
  }
};

export const updateDraggablesRequisite = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_REQUISITE,
    payload: newList,
  });
};

export const updateDraggablesWhatLearnt = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_WHATLEARNT,
    payload: newList,
  });
};

export const updateDraggablesWhoIsFor = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_WHOISFOR,
    payload: newList,
  });
};

export const resetCreateVariables = () => async (dispatch) => {
  dispatch({
    type: RESET_CREATE_VARIABLES,
  });
};

export const updateCourseWelcomeMessage = (courseUUID, message) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      message,
    });

    const res = await axios.put(`/api/sell/courses/updateWelcomeMessage`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateCourseCongratsMessage = (courseUUID, message) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      message,
    });

    const res = await axios.put(`/api/sell/courses/updateCongratsMessage`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateCourseStatus = (courseUUID, bool) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      courseUUID,
      bool,
    });

    const res = await axios.put('/api/sell/courses/updateStatus', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const createCourseNFT = (courseUUID, price) => async (dispatch) => {
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
      price,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_CRYPTO_API_URL}/api/courses/nft_deploy/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: DEPLOY_COURSE_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const resetCourseNFT = () => async (dispatch) => {
  dispatch({
    type: DEPLOY_COURSE_FAIL,
  });
};

export const updateCourseKeywords = (courseUUID, keywords) => async (dispatch) => {
  try {
    const res = await axios.put('/api/sell/courses/updateKeywords', {
      courseUUID,
      keywords,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess(`Keywords saved`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.data.error}`);
  }
};

export const updateCourseStock = (courseUUID, stock) => async (dispatch) => {
  try {
    const res = await axios.put('/api/sell/courses/updateStock', {
      courseUUID,
      stock,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess(`Stock saved`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.data.error}`);
  }
};

export const updateCourseSlug = (courseUUID, slug) => async (dispatch) => {
  try {
    const res = await axios.put('/api/sell/courses/updateSlug', {
      courseUUID,
      slug,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_COURSE_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess(`Slug saved`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.data.error}`);
  }
};
