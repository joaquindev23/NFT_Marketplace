import axios from 'axios';
import { ToastSuccess } from '@/components/ToastSuccess';
import { ToastError } from '../../../components/toast/ToastError';
import {
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAIL,
  ONCHANGE_GOALS_WHATLEARNT_SUCCESS,
  EDIT_GOALS_WHATLEARNT_FAIL,
  ONCHANGE_GOALS_REQUIREMENTS_SUCCESS,
  ONCHANGE_GOALS_REQUIREMENTS_FAIL,
  ONCHANGE_GOALS_WHOISFOR_FAIL,
  EDIT_GOALS_REQUIREMENTS_SUCCESS,
  EDIT_GOALS_REQUIREMENTS_FAIL,
  EDIT_GOALS_WHOISFOR_SUCCESS,
  EDIT_GOALS_WHOISFOR_FAIL,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAIL,
  ONCHANGE_PRODUCT_DESCRIPTION_SUCCESS,
  ONCHANGE_PRODUCT_DESCRIPTION_FAIL,
  ONCHANGE_PRODUCT_TITLE_SUCCESS,
  ONCHANGE_PRODUCT_TITLE_FAIL,
  ONCHANGE_PRODUCT_SUB_TITLE_SUCCESS,
  ONCHANGE_PRODUCT_SUB_TITLE_FAIL,
  ONCHANGE_PRODUCT_LANGUAGE_SUCCESS,
  ONCHANGE_PRODUCT_LANGUAGE_FAIL,
  ONCHANGE_PRODUCT_LEVEL_SUCCESS,
  ONCHANGE_PRODUCT_LEVEL_FAIL,
  ONCHANGE_PRODUCT_CATEGORY_SUCCESS,
  ONCHANGE_PRODUCT_CATEGORY_FAIL,
  ONCHANGE_PRODUCT_STOCK_SUCCESS,
  ONCHANGE_PRODUCT_STOCK_FAIL,
  ONCHANGE_PRODUCT_IMAGE_FILENAME_SUCCESS,
  ONCHANGE_PRODUCT_IMAGE_FAIL,
  ONCHANGE_PRODUCT_IMAGE_FILENAME_FAIL,
  ONCHANGE_PRODUCT_VIDEO_FILENAME_SUCCESS,
  ONCHANGE_PRODUCT_VIDEO_FAIL,
  ONCHANGE_PRODUCT_VIDEO_FILENAME_FAIL,
  PERCENTAGE_SALES_VIDEO_UPLOAD,
  PERCENTAGE_THUMBNAIL_UPLOAD,
  IMAGE_UPLOADED_SUCCESS,
  IMAGE_UPLOADED_FAIL,
  VIDEO_UPLOADED_SUCCESS,
  VIDEO_UPLOADED_FAIL,
  ONCHANGE_PRODUCT_DETAILS_FAIL,
  ONCHANGE_PRODUCT_SIZE_FAIL,
  ONCHANGE_PRODUCT_COLORS_SUCCESS,
  ONCHANGE_PRODUCT_COLORS_FAIL,
  EDIT_PRODUCT_COLORS_SUCCESS,
  EDIT_PRODUCT_COLORS_FAIL,
  EDIT_PRODUCT_SIZES_SUCCESS,
  EDIT_PRODUCT_SIZES_FAIL,
  EDIT_PRODUCT_DETAILS_SUCCESS,
  EDIT_PRODUCT_DETAILS_FAIL,
  ADD_SIZE,
  REMOVE_SIZE,
  ADD_COLOR,
  REMOVE_COLOR,
  UPDATE_DRAGGABLES_SIZE,
  UPDATE_DRAGGABLES_COLOR,
  ON_CHANGE_PRODUCT_SIZES,
  UPDATE_DRAGGABLES_DETAIL,
  ADD_DETAIL,
  REMOVE_DETAIL,
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
} from './types';

export const getProduct = (productUUID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/sell/products/get?productUUID=${productUUID}`);

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    } else {
      dispatch({
        type: GET_PRODUCT_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_PRODUCT_FAIL,
    });
  }
};

export const onchangeProductWhatlearnt = (whatlearntlist) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_GOALS_WHATLEARNT_SUCCESS,
    payload: whatlearntlist,
  });
};

export const resetProductWhatlearnt = () => async (dispatch) => {
  dispatch({
    type: EDIT_GOALS_WHATLEARNT_FAIL,
  });
};

export const onchangeProductRequisites = (requisites) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_GOALS_REQUIREMENTS_SUCCESS,
    payload: requisites,
  });
};

export const resetProductRequisites = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_GOALS_REQUIREMENTS_FAIL,
  });
};

export const resetProductWhoIsFor = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_GOALS_WHOISFOR_FAIL,
  });
};

export const createProductWhatlearnt = (productUUID, whatlearnt) => async (dispatch) => {
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
      productUUID,
      whatlearnt,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/whatlearnt/create/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: EDIT_GOALS_WHATLEARNT_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: EDIT_GOALS_WHATLEARNT_FAIL,
    });
  }
};
export const createProductRequisites = (productUUID, requisites) => async (dispatch) => {
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
      productUUID,
      requisites,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/requisites/create/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: EDIT_GOALS_REQUIREMENTS_SUCCESS,
      });
    }
  } catch (err) {
    dispatch({
      type: EDIT_GOALS_REQUIREMENTS_FAIL,
    });
  }
};

export const createProduct =
  (title, category, businessActivity, type, user, address, polygonAddress) => async (dispatch) => {
    const controller = new AbortController();
    const abortSignal = controller.signal;

    try {
      const body = {
        title,
        category,
        businessActivity,
        type,
        user,
        address,
        polygonAddress,
      };

      const res = await axios.post('/api/sell/products/create', body, {
        signal: abortSignal,
      });

      if (res.status === 201) {
        dispatch({
          type: CREATE_PRODUCT_SUCCESS,
          payload: res.data.results,
        });
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
        dispatch({
          type: CREATE_PRODUCT_FAIL,
        });
      } else {
        console.log(err);
        ToastError(err.response.data.error);
        dispatch({
          type: CREATE_PRODUCT_FAIL,
        });
        throw err;
      }
    }
  };

export const createProductWhoIsFor = (productUUID, whoIsFor) => async (dispatch) => {
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
      productUUID,
      whoIsFor,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/whoIsFor/create/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: EDIT_GOALS_WHOISFOR_SUCCESS,
      });
    }
  } catch (err) {
    dispatch({
      type: EDIT_GOALS_WHOISFOR_FAIL,
    });
  }
};

export const resetProduct = () => async (dispatch) => {
  dispatch({
    type: CREATE_PRODUCT_FAIL,
  });
};

export const onchangeProductDescription = (description) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_DESCRIPTION_SUCCESS,
    payload: description,
  });
};

export const resetProductDescription = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_DESCRIPTION_FAIL,
  });
};

export const onchangeProductTitle = (title) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_TITLE_SUCCESS,
    payload: title,
  });
};
export const resetProductTitle = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_TITLE_FAIL,
  });
};

export const onchangeProductSubTitle = (subTitle) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_SUB_TITLE_SUCCESS,
    payload: subTitle,
  });
};
export const resetProductSubTitle = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_SUB_TITLE_FAIL,
  });
};

export const onchangeProductLanguage = (language) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_LANGUAGE_SUCCESS,
    payload: language,
  });
};
export const resetProductLanguage = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_LANGUAGE_FAIL,
  });
};

export const onchangeProductLevel = (level) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_LEVEL_SUCCESS,
    payload: level,
  });
};
export const resetProductLevel = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_LEVEL_FAIL,
  });
};

export const onchangeProductCategory = (category) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_CATEGORY_SUCCESS,
    payload: category,
  });
};
export const resetProductCategory = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_CATEGORY_FAIL,
  });
};

export const onchangeProductStock = (stock) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_STOCK_SUCCESS,
    payload: stock,
  });
};
export const resetProductStock = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_STOCK_FAIL,
  });
};

// export const onchangeProductImage = (image) => async (dispatch) => {
//   dispatch({
//     type: ONCHANGE_PRODUCT_IMAGE_SUCCESS,
//     payload: image,
//   });
// };
export const onchangeProductImageFilename = (filename) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_IMAGE_FILENAME_SUCCESS,
    payload: filename,
  });
};
export const resetProductImage = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_IMAGE_FAIL,
  });
  dispatch({
    type: ONCHANGE_PRODUCT_IMAGE_FILENAME_FAIL,
  });
};

// export const onchangeProductVideo = (video, filename) => async (dispatch) => {
//   dispatch({
//     type: ONCHANGE_PRODUCT_VIDEO_SUCCESS,
//     payload: video,
//   });
//   dispatch({
//     type: ONCHANGE_PRODUCT_VIDEO_FILENAME_SUCCESS,
//     payload: filename,
//   });
// };

export const onchangeProductVideoFilename = (filename) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_VIDEO_FILENAME_SUCCESS,
    payload: filename,
  });
};

export const resetProductVideo = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_VIDEO_FAIL,
  });
  dispatch({
    type: ONCHANGE_PRODUCT_VIDEO_FILENAME_FAIL,
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

export const resetProductDetails = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_DETAILS_FAIL,
  });
};

export const resetProductColors = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_COLORS_FAIL,
  });
};

export const onchangeProductColors = (color) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_COLORS_SUCCESS,
    payload: color,
  });
};

export const onchangeProductSizes = (sizesList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_SIZES,
    payload: sizesList,
  });
};

export const addSize = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_SIZE,
    payload: newItem,
  });
};

export const removeSize = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_SIZE,
    payload: index,
  });
};

export const updateDraggablesSize = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_SIZE,
    payload: newList,
  });
};

export const updateDraggablesColor = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_COLOR,
    payload: newList,
  });
};

export const addColor = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_COLOR,
    payload: newItem,
  });
};

export const removeColor = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_COLOR,
    payload: index,
  });
};

export const resetProductSizes = () => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_SIZE_FAIL,
  });
};

export const updateDraggablesDetail = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_DETAIL,
    payload: newList,
  });
};

export const addDetail = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_DETAIL,
    payload: newItem,
  });
};

export const removeDetail = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_DETAIL,
    payload: index,
  });
};

export const onchangeProductDetails = (details) => async (dispatch) => {
  dispatch({
    type: ONCHANGE_PRODUCT_DETAILS_SUCCESS,
    payload: details,
  });
};

export const updateProductStock = (productUUID, stock) => async (dispatch) => {
  try {
    const res = await axios.put('/api/sell/products/updateStock', {
      productUUID,
      stock,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess(`Stock saved`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.data.error}`);
  }
};

export const updateProductDetails = (productUUID, details) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      details,
    };

    const res = await axios.post('/api/sell/products/updateDetails', body);

    if (res.status === 200) {
      dispatch({
        type: EDIT_PRODUCT_DETAILS_SUCCESS,
      });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductDetail = (productUUID, detailID) => async (dispatch) => {
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
      productUUID,
      detailID,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/details/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateProductSizes = (productUUID, sizes) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      sizes,
    };

    const res = await axios.post('/api/sell/products/updateSizes', body);

    if (res.status === 200) {
      dispatch({
        type: EDIT_PRODUCT_SIZES_SUCCESS,
      });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    dispatch({
      type: EDIT_PRODUCT_SIZES_FAIL,
    });
  }
};
export const deleteProductSize = (productUUID, id) => async (dispatch) => {
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
      productUUID,
      id,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/sizes/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateProductColors = (productUUID, colors) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      colors,
    };

    const res = await axios.post('/api/sell/products/updateColors', body);

    if (res.status === 200) {
      dispatch({
        type: EDIT_PRODUCT_COLORS_SUCCESS,
      });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    dispatch({
      type: EDIT_PRODUCT_COLORS_FAIL,
    });
  }
};

export const deleteProductColor = (productUUID, id) => async (dispatch) => {
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
      productUUID,
      id,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/colors/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesWhatLearnt = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_WHATLEARNT,
    payload: newList,
  });
};

export const addWhatLearnt = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_WHATLEARNT,
    payload: newItem,
  });
};

export const removeWhatLearnt = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_WHATLEARNT,
    payload: index,
  });
};

export const onchangeProductWhatLearnt = (detailsList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_WHATLEARNT,
    payload: detailsList,
  });
};

export const updateProductWhatLearnt = (productUUID, whatlearntList) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      whatlearntList,
    });

    const res = await fetch('/api/sell/products/updateWhatlearnt', {
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
        type: GET_PRODUCT_SUCCESS,
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

export const deleteProductWhatLearnt = (productUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      id,
    });

    const res = await fetch('/api/sell/products/deleteWhatlearnt', {
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
        type: GET_PRODUCT_SUCCESS,
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

export const updateDraggablesWhoIsFor = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_WHOISFOR,
    payload: newList,
  });
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

export const onchangeProductWhoIsFor = (whoIsForList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_WHOISFOR,
    payload: whoIsForList,
  });
};

export const updateProductWhoIsFor = (productUUID, whoIsForList) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      whoIsForList,
    });

    const res = await fetch('/api/sell/products/updateWhoisfor', {
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
        type: GET_PRODUCT_SUCCESS,
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

export const deleteProductWhoIsFor = (productUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      id,
    });

    const res = await fetch('/api/sell/products/deleteWhoisfor', {
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
        type: GET_PRODUCT_SUCCESS,
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

export const updateDraggablesRequisite = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_REQUISITE,
    payload: newList,
  });
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

export const onchangeProductRequisite = (requisitesList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_REQUISITE,
    payload: requisitesList,
  });
};

export const updateProductRequisite = (productUUID, requisitesList) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      requisitesList,
    });

    const res = await fetch('/api/sell/products/updateRequisites', {
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
        type: GET_PRODUCT_SUCCESS,
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

export const deleteProductRequisite = (productUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      id,
    });

    const res = await fetch('/api/sell/products/deleteRequisite', {
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
        type: GET_PRODUCT_SUCCESS,
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

export const updateDraggablesWeight = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_WEIGHT,
    payload: newList,
  });
};

export const addWeight = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_WEIGHT,
    payload: newItem,
  });
};

export const removeWeight = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_WEIGHT,
    payload: index,
  });
};

export const onchangeProductWeight = (weightsList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_WEIGHT,
    payload: weightsList,
  });
};

export const updateProductWeight = (productUUID, weightsList) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      weightsList,
    };

    const res = await axios.post('/api/sell/products/updateWeights', body);

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductWeight = (productUUID, id) => async (dispatch) => {
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
      productUUID,
      id,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/weights/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesMaterial = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_MATERIAL,
    payload: newList,
  });
};

export const addMaterial = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_MATERIAL,
    payload: newItem,
  });
};

export const removeMaterial = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_MATERIAL,
    payload: index,
  });
};

export const onchangeProductMaterial = (materialsList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_MATERIAL,
    payload: materialsList,
  });
};

export const updateProductMaterial = (productUUID, materialsList) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      materialsList,
    };

    const res = await axios.post('/api/sell/products/updateMaterials', body);

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductMaterial = (productUUID, id) => async (dispatch) => {
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
      productUUID,
      id,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/materials/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
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

export const onchangeProductImage = (imagesList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_IMAGE,
    payload: imagesList,
  });
};

export const updateProductImage = (productUUID, imagesList) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('productUUID', productUUID);
    imagesList.forEach((image, index) => {
      formData.append(`imagesList[${index}].id`, image.id);
      formData.append(`imagesList[${index}].position_id`, image.position_id);
      formData.append(`imagesList[${index}].title`, image.title);
      formData.append(`imagesList[${index}].file`, image.file);
    });

    const res = await axios.post('/api/sell/products/images/create', formData);

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductImage = (productUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      id,
    });

    const res = await axios.post('/api/sell/products/images/delete', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
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

export const onchangeProductVideo = (videosList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_VIDEO,
    payload: videosList,
  });
};

export const updateProductVideo =
  (productUUID, videosList, onUploadProgress) => async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('productUUID', productUUID);
      videosList.forEach((video, index) => {
        formData.append(`videosList[${index}].id`, video.id);
        formData.append(`videosList[${index}].position_id`, video.position_id);
        formData.append(`videosList[${index}].title`, video.title);
        formData.append(`videosList[${index}].file`, video.file);
      });

      const res = await axios.post('/api/sell/products/videos/create', formData, {
        onUploadProgress,
      });

      if (res.status === 200) {
        dispatch({
          type: GET_PRODUCT_SUCCESS,
          payload: res.data.results,
        });
      }
    } catch (err) {
      ToastError(`Error: ${err.response.statusText}`);
    }
  };

export const deleteProductVideo = (productUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      id,
    });

    const res = await axios.post('/api/sell/products/videos/delete', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesShipping = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_SHIPPING,
    payload: newList,
  });
};

export const addShipping = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_SHIPPING,
    payload: newItem,
  });
};

export const removeShipping = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_SHIPPING,
    payload: index,
  });
};

export const onchangeProductShipping = (shippingList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_SHIPPING,
    payload: shippingList,
  });
};

export const updateProductShipping = (productUUID, shippingList) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      shippingList,
    };

    const res = await axios.post(`/api/sell/products/shipping/update`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductShipping = (productUUID, id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      id,
    });

    const res = await axios.post('/api/sell/products/shipping/delete', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesDocument = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_DOCUMENT,
    payload: newList,
  });
};

export const addDocument = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_DOCUMENT,
    payload: newItem,
  });
};

export const removeDocument = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_DOCUMENT,
    payload: index,
  });
};

export const onchangeProductDocument = (documentsList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_DOCUMENT,
    payload: documentsList,
  });
};

export const updateProductDocument = (productUUID, documentsList) => async (dispatch) => {
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
      productUUID,
      documentsList,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/documents/create/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductDocument = (productUUID, id) => async (dispatch) => {
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
      productUUID,
      id,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/documents/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateDraggablesResource = (newList) => async (dispatch) => {
  dispatch({
    type: UPDATE_DRAGGABLES_RESOURCE,
    payload: newList,
  });
};

export const addResource = (newItem) => async (dispatch) => {
  dispatch({
    type: ADD_RESOURCE,
    payload: newItem,
  });
};

export const removeResource = (index) => async (dispatch) => {
  dispatch({
    type: REMOVE_RESOURCE,
    payload: index,
  });
};

export const onchangeProductResource = (resourcesList) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_RESOURCE,
    payload: resourcesList,
  });
};

export const updateProductResource = (productUUID, resourcesList) => async (dispatch) => {
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
      productUUID,
      resourcesList,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/resources/create/`,
      body,
      config,
    );

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const deleteProductResource = (productUUID, id) => async (dispatch) => {
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
      productUUID,
      id,
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PRODUCTS_URL}/api/products/resources/delete/`,
      body,
      config,
    );

    if (res.status === 200) {
      // dispatch({
      //   type: EDIT_PRODUCT_DETAILS_SUCCESS,
      // });
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const resetCreateVariables = () => async (dispatch) => {
  dispatch({
    type: RESET_CREATE_VARIABLES,
  });
};

export const updateProduct = (productUUID, productBody) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      productBody,
    };

    const res = await axios.put('/api/sell/products/update', body);

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const onchangeProductPrice = (price) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_PRICE,
    payload: price,
  });
};
export const onchangeProductComparePrice = (price) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_COMPARE_PRICE,
    payload: price,
  });
};
export const onchangeProductDiscountUntil = (discount) => async (dispatch) => {
  dispatch({
    type: ON_CHANGE_PRODUCT_DISCOUNT_UNTIL,
    payload: discount,
  });
};

export const updateProductPricing = (productUUID, productBody) => async (dispatch) => {
  try {
    const body = {
      productUUID,
      productBody,
    };
    const res = await axios.put('/api/sell/products/updatePricing', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
    return res;
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
    return null;
  }
};

export const updateProductWelcomeMessage = (productUUID, message) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      message,
    });

    const res = await axios.put(`/api/sell/products/updateWelcomeMessage`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateProductCongratsMessage = (productUUID, message) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      message,
    });

    const res = await axios.put(`/api/sell/products/updateCongratsMessage`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateProductStatus = (productUUID, bool) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      productUUID,
      bool,
    });

    const res = await axios.put('/api/sell/products/updateStatus', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
    }
  } catch (err) {
    ToastError(`Error: ${err.response.statusText}`);
  }
};

export const updateProductKeywords = (productUUID, keywords) => async (dispatch) => {
  try {
    const res = await axios.put('/api/sell/products/updateKeywords', {
      productUUID,
      keywords,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess(`Keywords saved`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.data.error}`);
  }
};

export const updateProductSlug = (productUUID, slug) => async (dispatch) => {
  try {
    const res = await axios.put('/api/sell/products/updateSlug', {
      productUUID,
      slug,
    });

    if (res.status === 200) {
      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: res.data.results,
      });
      ToastSuccess(`Slug saved`);
    }
  } catch (err) {
    ToastError(`Error: ${err.response.data.error}`);
  }
};
