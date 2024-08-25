import axios from 'axios';
import { loadUser, loadUserProfile } from '../auth/auth';
import {
  EDIT_USERNAME_SUCCESS,
  EDIT_USERNAME_FAIL,
  EDIT_FIRST_NAME_SUCCESS,
  EDIT_FIRST_NAME_FAIL,
  EDIT_LAST_NAME_SUCCESS,
  EDIT_LAST_NAME_FAIL,
  EDIT_LOCATION_SUCCESS,
  EDIT_LOCATION_FAIL,
  EDIT_URL_SUCCESS,
  EDIT_URL_FAIL,
  EDIT_BIRTHDAY_SUCCESS,
  EDIT_BIRTHDAY_FAIL,
  EDIT_BIO_SUCCESS,
  EDIT_BIO_FAIL,
  EDIT_FACEBOOK_SUCCESS,
  EDIT_FACEBOOK_FAIL,
  EDIT_TWITTER_SUCCESS,
  EDIT_TWITTER_FAIL,
  EDIT_INSTAGRAM_SUCCESS,
  EDIT_INSTAGRAM_FAIL,
  EDIT_YOUTUBE_SUCCESS,
  EDIT_YOUTUBE_FAIL,
  EDIT_LINKEDIN_SUCCESS,
  EDIT_LINKEDIN_FAIL,
  EDIT_GITHUB_SUCCESS,
  EDIT_GITHUB_FAIL,
  EDIT_PICTURE_SUCCESS,
  EDIT_PICTURE_FAIL,
  EDIT_BANNER_SUCCESS,
  EDIT_BANNER_FAIL,
} from './types';
// import { setAlert } from '../alerts/alert'
// import {load_user_profile, load_user} from '../auth/auth'

export const editUsername = (username) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    username,
  });

  try {
    const res = await axios.put('/api/profiles/edit-username', body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_USERNAME_SUCCESS,
      });
      dispatch(loadUser());
    } else {
      dispatch({
        type: EDIT_USERNAME_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: EDIT_USERNAME_FAIL,
    });
  }
};

export const editPicture = (picture) => async (dispatch) => {
  const access = localStorage.getItem('access');
  const body = JSON.stringify({
    picture,
  });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/profiles/edit/picture`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${access}`,
      },
      body,
    });

    if (res.status === 200) {
      dispatch({
        type: EDIT_PICTURE_SUCCESS,
      });
      // dispatch(setAlert("Banner edited", "success"))
    } else {
      dispatch({
        type: EDIT_PICTURE_FAIL,
      });
      // dispatch(setAlert('Username already exists', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_PICTURE_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editBanner = (banner) => async (dispatch) => {
  const access = localStorage.getItem('access');

  const formData = new FormData();
  formData.append('thumbnail', banner, banner.name);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/profiles/edit/banner`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
      body: formData,
    });

    if (res.status === 200) {
      dispatch({
        type: EDIT_BANNER_SUCCESS,
      });
      // dispatch(setAlert("Banner ", "success"))
    } else {
      dispatch({
        type: EDIT_BANNER_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_BANNER_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editFirstName = (firstName) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    first_name: firstName,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-first-name`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_FIRST_NAME_SUCCESS,
      });
      dispatch(loadUser());
      // dispatch(setAlert("First Name edited", "success"))
    } else {
      dispatch({
        type: EDIT_FIRST_NAME_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_FIRST_NAME_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editLastName = (lastName) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    last_name: lastName,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-last-name`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_LAST_NAME_SUCCESS,
      });
      dispatch(loadUser());
      // dispatch(setAlert("Last Name edited", "success"))
    } else {
      dispatch({
        type: EDIT_LAST_NAME_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_LAST_NAME_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editLocation = (location) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    location,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-location`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_LOCATION_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Location edited", "success"))
    } else {
      dispatch({
        type: EDIT_LOCATION_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_LOCATION_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editUrl = (url) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    url,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-url`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_URL_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("URL edited", "success"))
    } else {
      dispatch({
        type: EDIT_URL_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_URL_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editBirthday = (birthday) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    birthday,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-birthday`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_BIRTHDAY_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Birthday edited", "success"))
    } else {
      dispatch({
        type: EDIT_BIRTHDAY_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_BIRTHDAY_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editBio = (profileInfo) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    profile_info: profileInfo,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-bio`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_BIO_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Bio edited", "success"))
    } else {
      dispatch({
        type: EDIT_BIO_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_BIO_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editFacebook = (facebook) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    facebook,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-facebook`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_FACEBOOK_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Facebook edited", "success"))
    } else {
      dispatch({
        type: EDIT_FACEBOOK_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_FACEBOOK_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editInstagram = (instagram) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    instagram,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-instagram`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_INSTAGRAM_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Instagram edited", "success"))
    } else {
      dispatch({
        type: EDIT_INSTAGRAM_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_INSTAGRAM_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editTwitter = (twitter) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    twitter,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-twitter`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_TWITTER_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Twitter edited", "success"))
    } else {
      dispatch({
        type: EDIT_TWITTER_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_TWITTER_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editYoutube = (youtube) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    youtube,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-youtube`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_YOUTUBE_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("YouTube edited", "success"))
    } else {
      dispatch({
        type: EDIT_YOUTUBE_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_YOUTUBE_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editLinkedin = (linkedin) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    linkedin,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-linkedin`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_LINKEDIN_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("LinkedIn edited", "success"))
    } else {
      dispatch({
        type: EDIT_LINKEDIN_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_LINKEDIN_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const editGithub = (github) => async (dispatch) => {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    github,
  });

  try {
    const res = await axios.put(`/api/profiles/edit-github`, body, config);

    if (res.status === 200) {
      dispatch({
        type: EDIT_GITHUB_SUCCESS,
      });
      dispatch(loadUserProfile());
      // dispatch(setAlert("Github edited", "success"))
    } else {
      dispatch({
        type: EDIT_GITHUB_FAIL,
      });
      // dispatch(setAlert('Error con el servidor', 'error'));
    }
  } catch (err) {
    dispatch({
      type: EDIT_GITHUB_FAIL,
    });
    // dispatch(setAlert(err.request.response, 'error'));
  }
};

export const becomeInstructor = () => async (dispatch) => {
  try {
    const res = await fetch('/api/user/instructor/become_instructor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.status === 200) {
      dispatch({
        type: EDIT_PICTURE_SUCCESS,
      });
      // dispatch(setAlert("Banner edited", "success"))
      // dispatch(load_user())
    } else {
      // dispatch({
      //     type:EDIT_PICTURE_FAIL
      // })
      // dispatch(setAlert('Username already exists', 'error'));
    }
  } catch (err) {
    // dispatch({
    //     type:EDIT_PICTURE_FAIL
    // })
    // dispatch(setAlert(err.request.response, 'error'));
  }
};
