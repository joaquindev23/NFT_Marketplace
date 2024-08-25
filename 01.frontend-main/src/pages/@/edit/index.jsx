import Head from 'next/head';
import cookie from 'cookie';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CheckBadgeIcon,
  GlobeAmericasIcon,
  PaperClipIcon,
  CalendarIcon,
  DocumentTextIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';
import { Tab } from '@headlessui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import slugify from 'react-slugify';

import Layout from '@/hocs/Layout';
import {
  editUsername,
  editFirstName,
  editLastName,
  editLocation,
  editUrl,
  editBirthday,
  editBio,
  editFacebook,
  editInstagram,
  editTwitter,
  editYoutube,
  editLinkedin,
  editGithub,
} from '@/redux/actions/user/user';
import { useRouter } from 'next/router';
import { loadUser, loadUserProfile } from '@/redux/actions/auth/auth';
import { ToastSuccess } from '@/components/ToastSuccess';
import Button from '@/components/Button';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SeoList = {
  title: 'Boomslag - Edit User Profile | Manage Your NFTs and Account Details',
  description:
    'Access your Boomslag user profile to manage your NFTs, account details, and preferences on our innovative marketplace for buying and selling products using ERC1155 tokens.',
  href: '/user-profile',
  url: 'https://boomslag.com/user-profile',
  keywords: 'user profile, manage nfts, account details, boomslag, nft marketplace',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@BoomSlag',
};

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  const myUser = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const router = useRouter();

  const [updateUsername, setUpdateUsername] = useState(false);
  const [updateFirstName, setUpdateFirstName] = useState(false);
  const [updateLastName, setUpdateLastName] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  const [updateURL, setUpdateURL] = useState(false);
  const [updateBirth, setUpdateBirth] = useState(false);
  const [updateBio, setUpdateBio] = useState(false);

  const [updateFacebook, setUpdateFacebook] = useState(false);
  const [updateTwitter, setUpdateTwitter] = useState(false);
  const [updateInstagram, setUpdateInstagram] = useState(false);
  const [updateLinkedIn, setUpdateLinkedIn] = useState(false);
  const [updateYouTube, setUpdateYouTube] = useState(false);
  const [updateGithub, setUpdateGithub] = useState(false);

  const [formDataUserAccount, setFormDataUserAccount] = useState({
    username: '',
    firstName: '',
    lastName: '',
  });

  const { username, firstName, lastName } = formDataUserAccount;

  const onChange = (e) => {
    setFormDataUserAccount({ ...formDataUserAccount, [e.target.name]: e.target.value });
  };

  const [formDataUserProfile, setFormDataUserProfile] = useState({
    location: '',
    url: '',
    birthday: '',
    profile_info: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    github: '',
  });

  const {
    location,
    url,
    birthday,
    profileInfo,
    facebook,
    twitter,
    instagram,
    linkedin,
    youtube,
    github,
  } = formDataUserProfile;

  const onChangeUserProfile = (e) => {
    setFormDataUserProfile({ ...formDataUserProfile, [e.target.name]: e.target.value });
  };

  const [formDataPassword, setFormDataPassword] = useState({
    newPassword: '',
    reNewPassword: '',
    currentPassword: '',
  });

  const { newPassword, reNewPassword, currentPassword } = formDataPassword;

  const onChangePassword = (e) => {
    setFormDataPassword({ ...formDataPassword, [e.target.name]: e.target.value });
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      new_password: newPassword,
      re_new_password: reNewPassword,
      current_password: currentPassword,
    });

    const res = await axios.post(`/api/profiles/edit-password`, body, config);

    if (res.status === 204) {
      ToastSuccess('Password changed');
      setFormDataPassword({
        newPassword: '',
        reNewPassword: '',
        currentPassword: '',
      });
    } else {
      ToastError('Error, incorrect credentials');
    }
  };

  const onSubmitEditUsername = (e) => {
    e.preventDefault();
    dispatch(editUsername(slugify(username)));
    setUpdateUsername(false);
    setFormDataUserAccount({
      username: '',
    });
  };

  const [imagePicture, setImagePicture] = useState();
  const [previewPicture, setPreviewPicture] = useState();
  const [imageBanner, setImageBanner] = useState();
  const [imageBannerFilename, setImageBannerFilename] = useState();
  const [imagePictureFilename, setImagePictureFilename] = useState();
  const [previewBanner, setPreviewBanner] = useState();

  const pictureSelectedHandler = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 2000000;

    if (!allowedFileTypes.includes(file.type)) {
      alert('Please select an image type of JPG / JPEG / PNG');
      fileInput.value = ''; // Reset the file input value
      setPreviewPicture(null);
      setImagePictureFilename(null);
      return;
    }

    if (file.size > maxFileSize) {
      alert('Please select an image with a size of 2MB or lower');
      fileInput.value = ''; // Reset the file input value
      setPreviewPicture(null);
      setImagePictureFilename(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setImagePicture(base64String);
    };

    reader.onloadend = () => {
      setImagePictureFilename(file.name);
      setPreviewPicture(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const bannerSelectedHandler = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 2000000;

    if (!allowedFileTypes.includes(file.type)) {
      alert('Please select an image type of JPG / JPEG / PNG');
      fileInput.value = ''; // Reset the file input value
      setPreviewBanner(null);
      setImageBannerFilename(null);
      return;
    }

    if (file.size > maxFileSize) {
      alert('Please select an image with a size of 2MB or lower');
      fileInput.value = ''; // Reset the file input value
      setPreviewBanner(null);
      setImageBannerFilename(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setImageBanner(base64String);
    };

    reader.onloadend = () => {
      setImageBannerFilename(file.name);
      setPreviewBanner(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const onSubmitEditPicture = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', imagePicture);
    formData.append('filename', imagePictureFilename);

    try {
      const res = await axios.put(`/api/profiles/edit-picture`, formData);
      if (res.status === 200) {
        // dispatch(setAlert('Picture Edited Successfully', 'success'));
        setImagePicture();
        setPreviewPicture();
        dispatch(loadUserProfile());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitEditBanner = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', imageBanner);
    formData.append('filename', imageBannerFilename);

    try {
      const res = await axios.put(`/api/profiles/edit-banner`, formData);
      if (res.status === 200) {
        // dispatch(setAlert('Picture Edited Successfully', 'success'));
        setImagePicture(null);
        setPreviewPicture(null);
        dispatch(loadUserProfile());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitEditFirstName = async (e) => {
    e.preventDefault();
    dispatch(editFirstName(firstName));
    setUpdateFirstName(false);
    setFormDataUserAccount({
      firstName: '',
    });
  };

  const onSubmitEditLastName = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editLastName(lastName));
      setUpdateLastName(false);
      setFormDataUserAccount({
        lastName: '',
      });
    }
  };

  const onSubmitEditLocation = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editLocation(location));
      setUpdateLocation(false);
      setFormDataUserProfile({
        location: '',
      });
    }
  };

  const onSubmitEditURL = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editUrl(url));
      setUpdateURL(false);
      setFormDataUserProfile({
        url: '',
      });
    }
  };

  const onSubmitEditBirthday = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editBirthday(birthday));
      setUpdateBirth(false);
      setFormDataUserProfile({
        birthday: '',
      });
    }
  };

  const onSubmitEditBio = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editBio(profileInfo));
      setUpdateBio(false);
      setFormDataUserProfile({
        profile_info: '',
      });
    }
  };

  const onSubmitEditFacebook = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editFacebook(facebook));
      setUpdateFacebook(false);
      setFormDataUserAccount({
        facebook: '',
      });
    }
  };

  const onSubmitEditInstagram = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editInstagram(instagram));
      setUpdateInstagram(false);
      setFormDataUserAccount({
        instagram: '',
      });
    }
  };

  const onSubmitEditLinkedIn = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editLinkedin(linkedin));
      setUpdateLinkedIn(false);
      setFormDataUserAccount({
        linkedin: '',
      });
    }
  };

  const onSubmitEditTwitter = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editTwitter(twitter));
      setUpdateTwitter(false);
      setFormDataUserAccount({
        twitter: '',
      });
    }
  };

  const onSubmitEditYouTube = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editYoutube(youtube));
      setUpdateYouTube(false);
      setFormDataUserAccount({
        youtube: '',
      });
    }
  };

  const onSubmitEditGithub = async (e) => {
    e.preventDefault();

    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(editGithub(github));
      setUpdateGithub(false);
      setFormDataUserAccount({
        github: '',
      });
    }
  };

  return (
    <div className="dark:bg-dark-bg">
      <Head>
        <title>{SeoList.title}</title>
        <meta name="description" content={SeoList.description} />

        <meta name="keywords" content={SeoList.keywords} />
        <link rel="canonical" href={SeoList.href} />
        <meta name="robots" content={SeoList.robots} />
        <meta name="author" content={SeoList.author} />
        <meta name="publisher" content={SeoList.publisher} />

        {/* Social Media Tags */}
        <meta property="og:title" content={SeoList.title} />
        <meta property="og:description" content={SeoList.description} />
        <meta property="og:url" content={SeoList.url} />
        <meta property="og:image" content={SeoList.image} />
        <meta property="og:image:width" content="1370" />
        <meta property="og:image:height" content="849" />
        <meta property="og:image:alt" content="Boomslag Thumbnail Image" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content={SeoList.title} />
        <meta name="twitter:description" content={SeoList.description} />
        <meta name="twitter:image" content={SeoList.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SeoList.twitterHandle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="z-10">
          {profile ? (
            <img
              className="h-32 w-full object-cover lg:h-48"
              src={profile && profile.banner}
              alt=""
            />
          ) : (
            <div>Loading</div>
          )}
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              {profile ? (
                <img
                  className="h-24 w-24 rounded-full ring-4 ring-white dark:ring-dark-second sm:h-32 sm:w-32"
                  src={profile && profile.picture}
                  alt=""
                />
              ) : (
                <div className="animate-pulse">
                  <span className="inline-block h-20 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-third">
                    <svg
                      className="h-full w-full text-gray-300 dark:bg-dark-main dark:text-dark-third"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-dark-txt">
                  {myUser ? <div>{myUser && myUser.username}</div> : <div>Loading</div>}
                  {profile && profile.verified ? (
                    <CheckBadgeIcon
                      className="ml-2 inline-flex h-4 w-4 text-purple-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <div />
                  )}
                </h1>
                <p className="text-md font-medium text-gray-900 dark:text-dark-txt-secondary">
                  Edit Profile
                </p>
              </div>
              {/* Here goes button */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 pb-32">
          <div className="col-span-12 ml-4 md:ml-12">
            <Tab.Group>
              <Tab.List className=" mt-8 -mb-px grid space-x-1 space-y-1 rounded-xl p-1 sm:flex sm:space-x-2 sm:space-y-0">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  User
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Profile
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Social
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                      '',
                      selected
                        ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                        : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                    )
                  }
                >
                  Security
                </Tab>
              </Tab.List>
              <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
                <div className="mx-auto max-w-3xl">
                  {/* Content goes here */}
                  <Tab.Panels>
                    {/* UserAccount Edit */}
                    <Tab.Panel>
                      <div>
                        <h3 className="text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
                          User Details
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm dark:text-dark-txt-secondary text-gray-500">
                          Edit personal details about you.
                        </p>
                      </div>
                      <div className="mt-5 border-t dark:border-dark-border border-gray-200">
                        <dl className="divide-y dark:divide-dark-border divide-gray-200">
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-mediumdark:text-dark-txt dark:text-dark-txt text-gray-500">
                              Username
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateUsername ? (
                                <form onSubmit={onSubmitEditUsername} className="flex w-full">
                                  <span className="flex-grow">
                                    <input
                                      value={username}
                                      onChange={(e) => onChange(e)}
                                      name="username"
                                      type="text"
                                      className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-4 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                      required
                                    />
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateUsername(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {myUser && myUser.username}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateUsername(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                              First Name
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateFirstName ? (
                                <form onSubmit={onSubmitEditFirstName} className="flex w-full">
                                  <span className="flex-grow">
                                    <input
                                      value={firstName}
                                      onChange={(e) => onChange(e)}
                                      name="firstName"
                                      type="text"
                                      className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-4 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                      required
                                    />
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateFirstName(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary ">
                                    {myUser && myUser.first_name}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateFirstName(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                              Last Name
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateLastName ? (
                                <form onSubmit={onSubmitEditLastName} className="flex w-full">
                                  <span className="flex-grow">
                                    <input
                                      value={lastName}
                                      onChange={(e) => onChange(e)}
                                      name="lastName"
                                      type="text"
                                      className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-4 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                      required
                                    />
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateLastName(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {myUser && myUser.last_name}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateLastName(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-lg font-medium text-gray-500">
                              {previewBanner ? (
                                <img
                                  className="inline-block h-20 w-full object-cover"
                                  src={previewBanner}
                                  alt=""
                                />
                              ) : (
                                <img
                                  className="inline-block h-20 w-full object-cover"
                                  src={profile && profile.banner}
                                  alt=""
                                />
                              )}
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              <span className="text-md flex-grow dark:text-dark-txt"> </span>
                              <span className="ml-4 flex-shrink-0">
                                <form onSubmit={onSubmitEditBanner}>
                                  <input
                                    id="file-upload"
                                    name="thumbnail"
                                    onChange={(e) => bannerSelectedHandler(e)}
                                    type="file"
                                    required
                                    className="ml-5 mt-2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-dark-third dark:bg-dark-main dark:text-dark-txt"
                                  />
                                  {previewBanner && (
                                    <button
                                      type="submit"
                                      className="text-indigo-600 hover:text-indigo-500 ml-4 inline-flex cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  )}
                                </form>
                              </span>
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-lg font-medium text-gray-500">
                              {previewPicture ? (
                                <img
                                  className="inline-block h-12 w-12 rounded-full object-cover"
                                  src={previewPicture}
                                  alt=""
                                />
                              ) : (
                                <img
                                  className="inline-block h-12 w-12 rounded-full object-cover"
                                  src={profile && profile.picture}
                                  alt=""
                                />
                              )}
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              <span className="text-md flex-grow dark:text-dark-txt"> </span>
                              <span className="ml-4 flex-shrink-0">
                                <form onSubmit={onSubmitEditPicture}>
                                  <input
                                    id="file-upload"
                                    name="thumbnail"
                                    onChange={(e) => pictureSelectedHandler(e)}
                                    type="file"
                                    required
                                    className="ml-5 mt-2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-dark-third dark:bg-dark-main dark:text-dark-txt"
                                  />
                                  {previewPicture && (
                                    <button
                                      type="submit"
                                      className="text-indigo-600 hover:text-indigo-500 ml-4 inline-flex cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  )}
                                </form>
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </Tab.Panel>
                    {/* PROFILE Edit */}
                    <Tab.Panel>
                      <div>
                        <h3 className="text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
                          Bio
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm dark:text-dark-txt-secondary text-gray-500">
                          Edit your profile information
                        </p>
                      </div>
                      <div className="mt-5 border-t border-gray-200 dark:border-dark-border">
                        <dl className="divide-y divide-gray-200 dark:divide-dark-border">
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                              Location
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateLocation ? (
                                <form onSubmit={onSubmitEditLocation} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <GlobeAmericasIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <input
                                        type="text"
                                        name="location"
                                        value={location}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder="City, Country"
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateLocation(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.location}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateLocation(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                              URL
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateURL ? (
                                <form onSubmit={onSubmitEditURL} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <PaperClipIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <input
                                        type="text"
                                        name="url"
                                        value={url}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder="https://domain.com"
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateURL(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.url}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateURL(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                              Birth Day
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateBirth ? (
                                <form onSubmit={onSubmitEditBirthday} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CalendarIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <input
                                        type="date"
                                        name="birthday"
                                        value={birthday}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.birthday !== '') ||
                                          (profile && profile.birthday !== null)
                                            ? profile.birthday
                                            : 'Birthday'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateBirth(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.birthday}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateBirth(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium dark:text-dark-txt text-gray-500">
                              Profile Info
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateBio ? (
                                <form onSubmit={onSubmitEditBio} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <DocumentTextIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <textarea
                                        rows={3}
                                        type="text"
                                        name="profileInfo"
                                        value={profileInfo}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.profile_info !== '') ||
                                          (profile && profile.profile_info !== null)
                                            ? profile.profile_info
                                            : 'Biography'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateBio(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.profile_info}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateBio(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </Tab.Panel>
                    {/* SOCIAL Edit */}
                    <Tab.Panel>
                      <div>
                        <h3 className="text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
                          Social media
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm dark:text-dark-txt-secondary text-gray-500">
                          Edit your social links
                        </p>
                      </div>

                      <div className="mt-5 border-t border-gray-200 dark:border-dark-border">
                        <dl className="divide-y divide-gray-200 dark:divide-dark-border">
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-lg font-medium text-gray-500">
                              <i className="bx bxl-twitter text-lg dark:text-dark-txt text-gray-400" />
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateTwitter ? (
                                <form onSubmit={onSubmitEditTwitter} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="bx bxl-twitter text-lg text-gray-400" />
                                      </div>
                                      <input
                                        type="text"
                                        name="twitter"
                                        value={twitter}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.twitter !== '') ||
                                          (profile && profile.twitter !== null)
                                            ? profile.twitter
                                            : 'Twitter URL'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateTwitter(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.twitter}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateTwitter(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="">
                              <i className="bx bxl-facebook-circle text-lg dark:text-dark-txt text-gray-400" />
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateFacebook ? (
                                <form onSubmit={onSubmitEditFacebook} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="bx bxl-facebook text-lg text-gray-400" />
                                      </div>{' '}
                                      <input
                                        type="text"
                                        name="facebook"
                                        value={facebook}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.facebook !== '') ||
                                          (profile && profile.facebook !== null)
                                            ? profile.facebook
                                            : 'Facebook URL'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateFacebook(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.facebook}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateFacebook(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="">
                              <i className="bx bxl-instagram text-lg dark:text-dark-txt text-gray-400" />
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateInstagram ? (
                                <form onSubmit={onSubmitEditInstagram} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="bx bxl-instagram text-lg text-gray-400" />
                                      </div>
                                      <input
                                        type="text"
                                        name="instagram"
                                        value={instagram}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.instagram !== '') ||
                                          (profile && profile.instagram !== null)
                                            ? profile.instagram
                                            : 'Instagram URL'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateInstagram(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.instagram}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateInstagram(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="">
                              <i className="bx bxl-youtube text-lg dark:text-dark-txt text-gray-400" />
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateYouTube ? (
                                <form onSubmit={onSubmitEditYouTube} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="bx bxl-youtube text-lg text-gray-400" />
                                      </div>
                                      <input
                                        type="text"
                                        name="youtube"
                                        value={youtube}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.youtube !== '') ||
                                          (profile && profile.youtube !== null)
                                            ? profile.youtube
                                            : 'YouTube URL'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateYouTube(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.youtube}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateYouTube(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="">
                              <i className="bx bxl-linkedin text-lg dark:text-dark-txt text-gray-400" />
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateLinkedIn ? (
                                <form onSubmit={onSubmitEditLinkedIn} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="bx bxl-linkedin text-lg text-gray-400" />
                                      </div>
                                      <input
                                        type="text"
                                        name="linkedin"
                                        value={linkedin}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.linkedin !== '') ||
                                          (profile && profile.linkedin !== null)
                                            ? profile.linkedin
                                            : 'LinkedIn URL'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateLinkedIn(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.linkedin}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateLinkedIn(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="">
                              <i className="bx bxl-github text-lg dark:text-dark-txt text-gray-400" />
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {updateGithub ? (
                                <form onSubmit={onSubmitEditGithub} className="flex w-full">
                                  <span className="flex-grow">
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="bx bxl-github text-lg text-gray-400" />
                                      </div>
                                      <input
                                        type="text"
                                        name="github"
                                        value={github}
                                        onChange={(e) => onChangeUserProfile(e)}
                                        required
                                        className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                        placeholder={`${
                                          (profile && profile.github !== '') ||
                                          (profile && profile.github !== null)
                                            ? profile.github
                                            : 'Github URL'
                                        }`}
                                      />
                                    </div>
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="submit"
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 mr-2 rounded-md font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setUpdateGithub(false)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                </form>
                              ) : (
                                <>
                                  <span className="text-md flex-grow dark:text-dark-txt-secondary">
                                    {profile && profile.github}
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setUpdateGithub(true)}
                                      className="dark:text-dark-accent dark:hover:text-dark-primary text-indigo-600 hover:text-indigo-500 inline-flex  cursor-pointer rounded-md font-medium"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </>
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </Tab.Panel>
                    {/* SECURITY Edit */}
                    <Tab.Panel>
                      <div>
                        <h3 className="text-lg font-bold leading-6 dark:text-dark-txt text-gray-900">
                          Security
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm dark:text-dark-txt-secondary text-gray-500">
                          Change your password
                        </p>
                      </div>

                      <div className="">
                        <dl className="divide-y divide-gray-200 dark:divide-dark-border">
                          <form onSubmit={onSubmitPassword} className="space-y-3">
                            <div className="sm:mx-auto sm:w-full sm:max-w-md ">
                              <div className="relative">
                                <div
                                  className="absolute inset-0 flex items-center"
                                  aria-hidden="true"
                                >
                                  <div className="w-full border-t border-gray-300 dark:border-dark-second" />
                                </div>
                                <div className="relative flex justify-center" />
                              </div>
                            </div>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => onChangePassword(e)}
                                required
                                className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                placeholder="New Password"
                              />
                            </div>

                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="reNewPassword"
                                value={reNewPassword}
                                onChange={(e) => onChangePassword(e)}
                                required
                                className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                placeholder="Repeat New Password"
                              />
                            </div>

                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => onChangePassword(e)}
                                required
                                className="text-md duration block w-full border focus:ring-none focus:outline-none border-dark py-3 pl-10 font-medium shadow-neubrutalism-xs transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                placeholder="Old Password"
                              />
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <div className="mt-2 flex">
                                <input
                                  className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                                  type="checkbox"
                                  id="show-password"
                                  onChange={toggleShowPassword}
                                />
                                <label
                                  className="ml-2 flex text-sm leading-5 text-gray-900 focus-within:text-blue-800"
                                  htmlFor="show-password"
                                >
                                  {showPassword ? (
                                    <span className="inline-flex dark:text-dark-txt-secondary text-gray-900">
                                      Hide password
                                    </span>
                                  ) : (
                                    <span className="inline-flex dark:text-dark-txt-secondary text-gray-900">
                                      Show password
                                    </span>
                                  )}
                                </label>
                              </div>
                            </div>
                            <Button type="submit">Change Password</Button>
                          </form>
                        </dl>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </div>
              </div>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

EditProfile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie ?? '');
  const accessToken = cookies.access ?? false;

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      accessToken,
    },
  };
}
