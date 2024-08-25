import Layout from './components/Layout';
import axios from 'axios';
import Head from 'next/head';
import cookie from 'cookie';
import html2canvas from 'html2canvas';

import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { CircleLoader } from 'react-spinners';
import moment from 'moment';
import { Dialog, Transition, Tab, Menu } from '@headlessui/react';
import DOMPurify from 'isomorphic-dompurify';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import slugify from 'react-slugify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ShareIcon,
  XMarkIcon,
  StarIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { Bars3CenterLeftIcon, PaperClipIcon, TrophyIcon } from '@heroicons/react/24/outline';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share';

import CustomVideo from '@/components/CustomVideo';
import FetchCoursePaid from '@/api/courses/GetPaid';
import FetchCourseReviews from '@/api/courses/ListReviews';
import VerifyTokenOwnership from '@/api/tokens/VerifyTicketOwnership';
import FetchSectionsPaid from '@/api/courses/sections/paid/List';
import LogoImg from '@/components/LogoImg';
import FetchEpisodeQuestions from '@/api/courses/questions/ListEpisodeQuestions';
import FetchCourseQuestions from '@/api/courses/questions/ListCourseQuestions';
import FetchViewedEpisodes from '@/api/courses/episodes/GetViewedEpisodes';
import GenerateCertificate from '@/api/courses/certificates/Generate';
import FetchCourseAuthor from '@/api/courses/GetCourseAuthor';
import CreateReview from '@/api/courses/CreateReview';
import GetCourseReview from '@/api/courses/GetReview';
import UpdateReview from '@/api/courses/UpdateReview';

import WatchList from './components/WatchList';
import AboutCourseSec from '@/components/AboutCourseSec';
import QuestionsSec from './components/QuestionsSec';
import ReviewsSec from './components/ReviewsSec';
import { useSelector } from 'react-redux';
import Button from '@/components/Button';
import { useRouter } from 'next/router';
import DarkModeButton from '@/components/DarkModeButton.jsx';
import Image from 'next/image';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CourseWatch({
  courseUUID,
  access,
  course,
  authorProfile,
  author,
  user,
  isTokenOwner,
}) {
  const SeoList = {
    title: course.details.title
      ? `Watch - ${course.details.title}`
      : 'Boomslag - Online Courses Marketplace',
    description:
      course.description ||
      'Discover and learn from the best online courses in various categories on Boomslag - the ultimate NFT marketplace for courses and products. Buy and sell using ERC1155 tokens to ensure seamless and secure transactions.',
    href: course.details.slug ? `/courses/${course.details.slug}` : '/',
    url: course.details.slug
      ? `https://boomslag.com/courses/${course.details.slug}`
      : 'https://boomslag.com',
    keywords: course.details.keywords
      ? `${course.details.keywords}, online courses, blockchain courses, boomslag courses, nft online courses`
      : 'online courses, blockchain courses, boomslag courses, nft online courses',
    robots: 'all',
    author: author.username || 'BoomSlag',
    publisher: 'BoomSlag',
    image:
      course.images && course.images.length > 0
        ? course.images[0].file
        : 'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/teach.png',
    twitterHandle: '@BoomSlag',
  };

  const router = useRouter();

  const details = course && course.details;
  const authState = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);

  // ========== FETCH SECTIONS
  const [loadingSections, setLoadingSections] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [sections, setSections] = useState(false);
  const fetchSections = useCallback(
    async (page, courseUUID) => {
      setLoadingSections(true);
      try {
        const res = await FetchSectionsPaid(courseUUID, page, pageSize, maxPageSize);
        setSections(res.data.results);
      } catch (err) {
        // eslint-disable-next-line
        // console.log(err);
      } finally {
        setLoadingSections(false);
      }
    },
    [pageSize, maxPageSize],
  );

  useEffect(() => {
    fetchSections(currentPage, courseUUID);
    // eslint-disable-next-line
  }, [courseUUID]);

  // =========== FETCH VIEWED EPISODES
  const [viewedEpisodes, setViewedEpisodes] = useState(false);
  const [viewedEpisodesCount, setViewedEpisodesCount] = useState(false);
  const fetchViewedEpisodes = useCallback(async () => {
    // setLoading(true);
    // setDataLoading(true);
    try {
      const res = await FetchViewedEpisodes(courseUUID);

      setViewedEpisodes(res.data.results);
      setViewedEpisodesCount(res.data.results.length);
    } catch (err) {
      // eslint-disable-next-line
      //   console.log(err);
    } finally {
      // setDataLoading(false);
    }
  }, [courseUUID]);

  useEffect(() => {
    fetchViewedEpisodes();
    // eslint-disable-next-line
  }, []);

  // FETCH REVIEWS //
  // ============ FETCH REVIEWS
  const [review, setReview] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [reviewsCounts, setReviewsCounts] = useState([]);
  const [reviewsTotalCount, setReviewsTotalCount] = useState(0);
  const [reviewsAvg, setReviewsAvg] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsPageSize, setReviewsPageSize] = useState(6);
  const [reviewsMaxPageSize, setReviewsMaxPageSize] = useState(100);
  const [reviewsNext, setReviewsNext] = useState(null);
  const [reviewsPrevious, setReviewsPrevious] = useState(null);
  const [loadingReview, setLoadingReview] = useState(true);
  const [selectedRating, setSelectedRating] = useState(undefined);
  const fetchReviews = useCallback(async () => {
    setLoadingReview(true);
    try {
      const res = await FetchCourseReviews(
        courseUUID,
        reviewsPage,
        reviewsPageSize,
        reviewsMaxPageSize,
        selectedRating,
      );
      setReviews(res.data.results);
      setReviewsCounts(res.data.extra_data.counts);
      setReviewsAvg(res.data.extra_data.average);
      setReviewsTotalCount(res.data.extra_data.totalCount);
      setReviewsNext(res.data.next);
      setReviewsPrevious(res.data.previous);
      setReviewsCount(res.data.count);
    } catch (err) {
      // ToastError('Error loading Reviews');
      //   console.log(err);
    } finally {
      setLoadingReview(false);
    }
  }, [courseUUID, reviewsPage, reviewsPageSize, reviewsMaxPageSize, selectedRating]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [courseUUID, selectedRating]);

  const handleViewMoreReviews = () => {
    setReviewsPageSize(reviewsPageSize + 6);
  };

  // ============= FETCH MY REVIEW
  const fetchReview = useCallback(async () => {
    const res = await GetCourseReview(courseUUID);

    if (res && res.status === 200) {
      setReview(res.data.results);
    }
  }, [courseUUID]);

  useEffect(() => {
    if (courseUUID) {
      fetchReview();
    }
  }, [courseUUID, fetchReview]);

  const [openShare, setOpenShare] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_PUBLIC_URL}/courses/${course.slug}`;

  // CERTIFICATE
  const [qrCode, setQRCode] = useState('');
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);
  const [loadingFetchCertificate, setLoadingFetchCertificate] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const pdfDownload = (e) => {
    e.preventDefault();
    const doc = new jsPDF('landscape', 'pt', 'A4');
    const pdfView = document.getElementById('pdf-view');
    const scale = 2; // You can adjust the scale value to improve image quality

    // Create canvas using html2canvas
    html2canvas(pdfView, { scale }).then((canvas) => {
      // Calculate the width and height of the canvas
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the canvas image to the PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.5); // Use JPEG compression with a quality setting of 0.5
      doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      doc.save(`certificate_of_completion${slugify(details && details.title)}.pdf`);
    });
  };

  const [qrGenerated, setGenerateQR] = useState(false);
  const generateQRCode = () => {
    QRCode.toDataURL(`https://polygonscan.com/address/${details.nft_address}`).then(setQRCode);
    setGenerateQR(true);
  };
  const [certificateGenerated, setGenerateCertificate] = useState(false);

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    setLoadingCertificate(true);

    const res = await GenerateCertificate(courseUUID);
    setCertificate(res.data.results);

    setLoadingCertificate(false);
    setGenerateCertificate(true);
  };

  useEffect(() => {
    if (details && author && authState) {
      setCertificate({
        id: crypto.randomUUID(),
        certificateUUID: crypto.randomUUID(),
        // Course Details
        title: details.title,
        description: details.short_description,
        // Instructor Details
        instructor: author.username,
        instructor_first_name: author.first_name,
        instructor_last_name: author.last_name,
        // User Details
        user: authState.user.username,
        user_first_name: authState.user.first_name,
        user_last_name: authState.user.last_name,
        user_picture: authState.profile?.picture,
        date: moment().format('MMM, Do, YYYY'),
        length: details.total_duration,
        student_rating: details.student_rating,
        student_rating_no: details.student_rating_no,
        price: details.price,
        qrCode,
        thumbnail: details.images[0].file,
        course_uuid: details.id,
      });
      generateQRCode();
    }
  }, [details, author, authState]);

  // COURSE CONTENT / SECTIONS
  const [src, setSrc] = useState(sections && sections[0].episodes[0].file);

  const [episodeQuestions, setEpisodeQuestions] = useState([]);
  const [episode, setEpisode] = useState(sections && sections[0].episodes[0]);
  const [content, setContent] = useState(sections && sections[0].episodes[0].content);
  const [title, setTitle] = useState(sections && sections[0].episodes[0].title);
  const [id, setId] = useState(sections && sections[0].episodes[0].id);

  const [resources, setResources] = useState(sections && sections[0].episodes[0].resources);

  const episodeUUID = episode && episode.id;

  // TODO: FETCH QUESTIONS AND FILTERS

  // QUESTIONS
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState(null);

  const [isOpenCreateQuestion, setIsOpenCreateQuestion] = useState(false);
  function closeModalCreateQuestion() {
    setIsOpenCreateQuestion(false);
  }

  const [formData, setFormData] = useState({
    questionTitle: '',
    questionBody: '',
    hasAcceptedAnswer: false,
  });
  const { questionTitle, questionBody, hasAcceptedAnswer } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const [searchTerm, setSearchTerm] = useState(false);

  const onSubmitSearch = (e) => {
    e.preventDefault();
  };

  const [questionsCount, setQuestionsCount] = useState([]);
  const [questionsPageSize, setQuestionsPageSize] = useState(6);
  const [currentQuestionsPage, setCurrentQuestionsPage] = useState(1);
  const [maxQuestionsPageSize, setMaxQuestionsPageSize] = useState(100);
  const [filterQuestionsBy, setFilterQuestionsBy] = useState(null);
  const [filterQuestionsByUserId, setFilterQuestionsByUserId] = useState(null);
  const [orderQuestionsBy, setOrderQuestionsBy] = useState('-created_date');

  const fetchEpisodeQuestions = useCallback(
    async (page, search) => {
      // setLoadingQuestions(true);
      try {
        const res = await FetchEpisodeQuestions(
          episodeUUID,
          page,
          questionsPageSize,
          maxQuestionsPageSize,
          orderQuestionsBy,
          filterQuestionsBy,
          filterQuestionsByUserId,
          search,
        );
        if (res.data) {
          setQuestionsCount(res.data.count);
          setQuestions(res.data.results);
        }
      } catch (err) {
        // eslint-disable-next-line
        // console.log(err);
      } finally {
        // setLoadingQuestions(false);
      }
    },
    [
      episodeUUID,
      questionsPageSize,
      maxQuestionsPageSize,
      orderQuestionsBy,
      filterQuestionsBy,
      filterQuestionsByUserId,
    ],
  );

  const fetchCourseQuestions = useCallback(
    async (page, search) => {
      // setLoadingQuestions(true);
      try {
        const res = await FetchCourseQuestions(
          courseUUID,
          page,
          questionsPageSize,
          maxQuestionsPageSize,
          orderQuestionsBy,
          filterQuestionsBy,
          filterQuestionsByUserId,
          search,
        );
        if (res.data) {
          setQuestionsCount(res.data.count);
          setQuestions(res.data.results);
        }
      } catch (err) {
        // eslint-disable-next-line
        // console.log(err);
      } finally {
        // setLoadingQuestions(false);
      }
    },
    [
      courseUUID,
      questionsPageSize,
      maxQuestionsPageSize,
      orderQuestionsBy,
      filterQuestionsBy,
      filterQuestionsByUserId,
    ],
  );

  useEffect(() => {
    if (courseUUID) {
      if (episode) {
        fetchEpisodeQuestions(currentQuestionsPage, '');
      } else {
      }
      fetchCourseQuestions(currentQuestionsPage, '');
    }
  }, [fetchCourseQuestions, fetchEpisodeQuestions, currentQuestionsPage, episode, courseUUID]);

  // SIDEBAR

  const [toggleSidebar, setToggleSidebar] = useState(false);

  const handleToggle = () => {
    if (toggleSidebar) {
      setToggleSidebar(false);
    } else {
      setToggleSidebar(true);
    }
  };

  useEffect(() => {
    if (!toggleSidebar) {
      // Show sidebar
      window.localStorage.setItem('sidebarToggle', 'false');
      const videoContent = document.getElementById('video-content');
      const staticSidebar = document.getElementById('static-sidebar');
      // console.log('Show SIdebar')
      staticSidebar.classList.add('md:flex');
      videoContent.classList.add('md:pr-80');
    } else {
      // Hide sidebar
      window.localStorage.setItem('sidebarToggle', 'true');
      const videoContent = document.getElementById('video-content');
      const staticSidebar = document.getElementById('static-sidebar');
      // console.log('Hide SIdebar')
      staticSidebar.classList.remove('md:flex');
      videoContent.classList.remove('md:pr-80');
    }
  }, [toggleSidebar]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [videoHidden, setVideoHidden] = useState(true);
  const [resourceHidden, setResourceHidden] = useState(true);

  const [questionHidden, setQuestionHidden] = useState(true);

  const handleQuestionHidden = () => {
    setQuestionHidden(!questionHidden);
    setVideoHidden(true);
    setResourceHidden(true);
  };

  const handleResourceHidden = () => {
    setResourceHidden(!resourceHidden);
    setQuestionHidden(true);
    setVideoHidden(true);
  };

  const [isOpenReview, setIsOpenReview] = useState(false);

  const [body, setBody] = useState('');
  const [rating, setRating] = useState('');

  const onReview = async (e) => {
    e.preventDefault();
    if (review) {
      const res = await UpdateReview(details && details.id, rating, body);
      if (res.status === 200) {
        setReview(res.data.results);
        setIsOpenReview(false);
        setBody('');
        setRating('');
        setIsOpenReview(false);
        fetchReviews();
      }
    } else {
      const res = await CreateReview(details && details.id, rating, body);
      if (res.status === 200) {
        setReview(res.data.results);
        setIsOpenReview(false);
        setBody('');
        setRating('');
        setIsOpenReview(false);
        fetchReviews();
      }
    }
  };

  const reviewsArea = () => (
    <ReviewsSec
      review={review}
      setReview={setReview}
      reviews={reviews}
      setReviews={setReviews}
      reviewsCount={reviewsCount}
      setReviewsCount={setReviewsCount}
      reviewsPage={reviewsPage}
      setReviewsPage={setReviewsPage}
      reviewsPageSize={reviewsPageSize}
      setReviewsPageSize={setReviewsPageSize}
      reviewsMaxPageSize={reviewsMaxPageSize}
      setReviewsMaxPageSize={setReviewsMaxPageSize}
      reviewsNext={reviewsNext}
      setReviewsNext={setReviewsNext}
      reviewsPrevious={reviewsPrevious}
      setReviewsPrevious={setReviewsPrevious}
      fetchReviews={fetchReviews}
      fetchReview={fetchReview}
      reviewsCounts={reviewsCounts}
      reviewsTotalCount={reviewsTotalCount}
      reviewsAvg={reviewsAvg}
      setSelectedRating={setSelectedRating}
      isOpenReview={isOpenReview}
      setIsOpenReview={setIsOpenReview}
    />
  );

  const tabArea = () => (
    <Tab.Group defaultIndex={0}>
      <Tab.List className="  -mb-px grid space-x-1 space-y-1 rounded-xl sm:flex sm:space-x-2 sm:space-y-0">
        {/* <Tab
                className={({ selected }) =>
                classNames(
                    'w-full py-4 text-lg leading-5 md:col-span-2 col-span-1 ',
                    '',
                    selected
                        ? 'flex items-center justify-center space-x-2 p-1 font-bold dark:text-dark-txt text-black  border-b-2 border-gray-900 dark:bg-dark-third'
                        : 'flex items-center justify-center md:space-x-2  font-semibold p-1 border-b-2 border-gray-50 hover:border-gray-200  dark:text-dark-txt text-gray-600 dark:hover:bg-dark-third'
                )
                }
                >
                <i className='bx bx-search-alt'></i>
            </Tab> */}
        <Tab
          className={({ selected }) =>
            classNames(
              'col-span-1 w-full py-4 text-lg leading-5 md:col-span-2',
              '',
              selected
                ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
            )
          }
        >
          Overview
        </Tab>
        <Tab
          onClick={async () => {
            setLoadingQuestions(true);
            // await fetchEpisodeQuestions(details && details.course_uuid);
            setLoadingQuestions(false);
          }}
          className={({ selected }) =>
            classNames(
              'col-span-1 w-full py-4 text-lg leading-5 md:col-span-2',
              '',
              selected
                ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
            )
          }
        >
          Q&A
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              'col-span-1 w-full py-4 text-lg leading-5 md:col-span-2',
              '',
              selected
                ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
            )
          }
        >
          Reviews
        </Tab>
      </Tab.List>
      <Tab.Panels>
        {/* <Tab.Panel>
                <ContentSearchSec
                setToggle={setToggle}
                handleToggle={handleToggle}
                toggle={toggle}
                loadingData={loadingData}
                loadingSections={loadingSections}
                setEpisodeQuestions={setEpisodeQuestions}
                episodeQuestions={episodeQuestions}
                fetchEpisodeQuestions={fetchEpisodeQuestions}
                sections={sections &&sections}
                setSrc={setSrc&&setSrc}
                setVideoHidden={ setVideoHidden&& setVideoHidden}
                videoHidden={videoHidden}
                content={content}
                setContent={setContent&&setContent}
                setTitle={setTitle&&setTitle}
                title={title}
                setEpisode={setEpisode&&setEpisode}
                setResources={setResources&&setResources}
                handleQuestionHidden={ handleQuestionHidden}
                questionHidden={questionHidden}
                setQuestionHidden={ setQuestionHidden}
                handleResourceHidden={handleResourceHidden}
                resourceHidden={resourceHidden}
                setResourceHidden={setResourceHidden&&setResourceHidden}
                />
                </Tab.Panel> */}
        {/* Overview */}
        <Tab.Panel>
          <AboutCourseSec
            details={details && details}
            certificate={certificate && certificate}
            setOpenCertificate={setOpenCertificate}
            viewedEpisodesCount={viewedEpisodesCount}
            authorProfile={authorProfile}
            author={author}
            // viewedEpisodesCount === details.total_lectures
          />
        </Tab.Panel>
        <Tab.Panel>
          <QuestionsSec
            setSrc={setSrc}
            authState={authState}
            setVideoHidden={setVideoHidden}
            setContent={setContent}
            setTitle={setTitle}
            setEpisode={setEpisode}
            setResources={setResources}
            setQuestionHidden={setQuestionHidden}
            episode={episode}
            setResourceHidden={setResourceHidden}
            episodeUUID={episodeUUID}
            loadingQuestions={loadingQuestions}
            questions={questions}
            questionsCount={questionsCount}
            fetchCourseQuestions={fetchCourseQuestions}
            setQuestionsCount={setQuestionsCount}
            setQuestions={setQuestions}
            questionsPageSize={questionsPageSize}
            setQuestionsPageSize={setQuestionsPageSize}
            currentQuestionsPage={currentQuestionsPage}
            setCurrentQuestionsPage={setCurrentQuestionsPage}
            maxQuestionsPageSize={maxQuestionsPageSize}
            setMaxQuestionsPageSize={setMaxQuestionsPageSize}
            filterQuestionsBy={filterQuestionsBy}
            setFilterQuestionsBy={setFilterQuestionsBy}
            filterQuestionsByUserId={filterQuestionsByUserId}
            setFilterQuestionsByUserId={setFilterQuestionsByUserId}
            orderQuestionsBy={orderQuestionsBy}
            setOrderQuestionsBy={setOrderQuestionsBy}
            fetchEpisodeQuestions={fetchEpisodeQuestions}
          />
        </Tab.Panel>
        <Tab.Panel>{reviewsArea()}</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );

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
      <div className="relative dark:bg-dark-bg">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col  pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          // onClick={()=>{toggleSidebar()}}
                          className="h-6 w-6 cursor-pointer text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <button
                      type="button"
                      onClick={() => history.back()}
                      className="font-poppins-medium mr-3 inline-flex items-center rounded-full text-xs text-black  hover:text-gray-900 dark:hover:text-gray-300"
                    >
                      <i className="bx bx-chevron-left text-2xl" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        router.back();
                      }}
                    >
                      <LogoImg />
                    </button>
                  </div>

                  <div className=" h-0 flex-1 overflow-y-auto">
                    <WatchList
                      id={id}
                      viewedEpisodes={viewedEpisodes}
                      fetchViewedEpisodes={fetchViewedEpisodes}
                      setId={setId}
                      setToggle={setToggleSidebar}
                      handleToggle={handleToggle}
                      toggle={toggleSidebar}
                      loadingData={loadingData}
                      details={details}
                      loadingSections={loadingSections}
                      setEpisodeQuestions={setEpisodeQuestions}
                      episodeQuestions={episodeQuestions}
                      fetchEpisodeQuestions={fetchEpisodeQuestions}
                      sections={sections && sections}
                      setSrc={setSrc && setSrc}
                      setVideoHidden={setVideoHidden && setVideoHidden}
                      videoHidden={videoHidden}
                      content={content}
                      setContent={setContent && setContent}
                      setTitle={setTitle && setTitle}
                      title={title}
                      setEpisode={setEpisode && setEpisode}
                      setResources={setResources && setResources}
                      handleQuestionHidden={handleQuestionHidden}
                      questionHidden={questionHidden}
                      setQuestionHidden={setQuestionHidden}
                      handleResourceHidden={handleResourceHidden}
                      resourceHidden={resourceHidden}
                      setResourceHidden={setResourceHidden && setResourceHidden}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* NAVBAR */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-700 bg-dark dark:border-dark-main dark:bg-dark-main">
          <button
            type="button"
            className="focus:ring-indigo-500 border-r  border-gray-700 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3CenterLeftIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-shrink-0 items-center ">
              <div className="hidden md:flex">
                <button
                  type="button"
                  onClick={() => {
                    router.back();
                  }}
                >
                  <LogoImg />
                </button>
              </div>
            </div>
            <span className="mt-5 ml-5 text-gray-700">&#124;</span>
            <div className="mt-5 ml-4 flex flex-1 truncate text-sm text-gray-200">
              {details && details.title}
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              <div className="absolute inset-y-0  right-0 flex cursor-pointer items-center  pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!review && (
                  <button
                    onClick={() => setIsOpenReview(true)}
                    type="button"
                    className="font-regular inline-flex w-full py-2 text-white hover:bg-opacity-10"
                  >
                    <StarIcon
                      className={`
                        ${review ? 'text-almond-600' : 'text-gray-500'} mt-0.5 h-5 w-auto
                        `}
                      aria-hidden="true"
                    />
                    <span className="mx-2 hover:text-gray-300">Leave a rating</span>
                  </button>
                )}

                <Transition.Root show={isOpenReview} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={setIsOpenReview}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <Dialog.Panel className="relative transform overflow-hidden rounded-lg dark:bg-dark-bg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                            <div>
                              <div className="mt-3 ">
                                <Dialog.Title
                                  as="p"
                                  className="text-lg font-bold leading-6 dark:text-dark-txt text-gray-900"
                                >
                                  {review ? 'Edit' : 'Leave a'} Rating
                                </Dialog.Title>
                                <form onSubmit={(e) => onReview(e)} className="my-4">
                                  <select
                                    name="rating"
                                    onChange={(e) => setRating(e.target.value)}
                                    value={rating}
                                    required
                                    placeholder="1 - 5"
                                  >
                                    <option value="" disabled>
                                      0 - 5
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>

                                  <textarea
                                    className="text-md duration block dark:ring-dark-border dark:border-dark-border w-full border focus:ring-none focus:outline-none border-dark py-2.5 pl-4 font-medium transition ease-in-out dark:bg-dark-second dark:text-dark-txt"
                                    type="text"
                                    name="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                    rows="3"
                                    placeholder="Reseña"
                                  />
                                  {loading ? (
                                    <Button type="button" className="mt-4">
                                      sending...
                                    </Button>
                                  ) : (
                                    <Button type="submit" className="mt-4">
                                      Send Review
                                    </Button>
                                  )}
                                </form>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>

                {loadingFetchCertificate ? (
                  <div />
                ) : (
                  <Menu as="div" className="relative inline-block  text-left">
                    <Menu.Button className="font-regular inline-flex w-full px-4  py-2 text-white hover:bg-opacity-10">
                      <div
                        className={`
                      ${
                        viewedEpisodesCount === details.total_lectures
                          ? 'border-almond-600'
                          : 'border-gray-500'
                      }
                      mr-1 items-center rounded-full border-2  p-2`}
                      >
                        <TrophyIcon
                          className={`
                      ${
                        viewedEpisodesCount === details.total_lectures
                          ? 'text-almond-600'
                          : 'text-gray-500'
                      } h-3 w-3
                      `}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="mx-2 mt-1 hover:text-gray-300">Progress</span>
                      <ChevronDownIcon className=" mt-2 h-4 w-4" aria-hidden="true" />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-dark-main shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-4">
                          {viewedEpisodesCount === details.total_lectures ? (
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={() => {
                                    setOpenCertificate(true);
                                  }}
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 text-gray-900 dark:text-dark-primary dark:bg-dark-second'
                                      : 'text-gray-700 dark:text-dark-txt',
                                    'text-md block cursor-pointer px-4 py-2',
                                  )}
                                >
                                  Download Certificate
                                </div>
                              )}
                            </Menu.Item>
                          ) : (
                            <div className="mt-2 grid w-full cursor-default  px-4">
                              <p className="font-bold">
                                {viewedEpisodesCount} of {details && details.total_lectures}{' '}
                                complete
                              </p>
                              <p className="font-regular mt-2">
                                Finish course to get your certificate
                              </p>
                            </div>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpenShare(true);
                  }}
                  className="mr-2 flex border dark:border-dark-second dark:text-dark-txt border-white px-4 py-2 font-bold text-white hover:bg-gray-50 hover:bg-opacity-10 hover:text-gray-100"
                >
                  Share
                  <ShareIcon className="mt-1 ml-1 inline-flex h-4 w-4 dark:text-dark-txt text-white" />
                </button>
                <Transition.Root show={openShare} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={setOpenShare}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-100"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-75"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <Dialog.Panel className="relative transform overflow-hidden bg-white dark:bg-dark-bg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                            <div>
                              <div className="mt-3 ">
                                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                                  <div className="ml-4">
                                    <h3 className="text-lg font-black leading-6 dark:text-dark-txt text-gray-900">
                                      Share this course
                                    </h3>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenShare(false);
                                    }}
                                    className="ml-4 flex-shrink-0"
                                  >
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                                <div className="mt-4">
                                  <div className="space-x-2 ">
                                    <CopyToClipboard text={shareUrl}>
                                      <div
                                        // onClick={()=>{
                                        //     dispatch(setAlert('URL Copied to clipboard','success'))
                                        // }}
                                        className="relative mb-4 cursor-pointer"
                                      >
                                        <div className="text-md block w-full truncate border dark:bg-dark-third dark:text-dark-txt-secondary dark:border-dark-border border-gray-700 py-4 pl-2 pr-12">
                                          {shareUrl}
                                        </div>
                                        <div className=" absolute inset-y-0 right-0 flex items-center dark:bg-dark-second border dark:border-dark-border dark:hover:bg-dark-main bg-dark-main px-6 hover:bg-gray-900">
                                          <span
                                            className="text-md font-bold dark:text-dark-txt text-white "
                                            id="price-currency"
                                          >
                                            Copy URL
                                          </span>
                                        </div>
                                      </div>
                                    </CopyToClipboard>
                                    <div className="items-center justify-center space-x-2 text-center">
                                      <FacebookShareButton url={shareUrl}>
                                        <FacebookIcon size={40} round />
                                      </FacebookShareButton>
                                      <WhatsappShareButton url={shareUrl}>
                                        <WhatsappIcon size={40} round />
                                      </WhatsappShareButton>
                                      <TwitterShareButton url={shareUrl}>
                                        <TwitterIcon size={40} round />
                                      </TwitterShareButton>
                                      <RedditShareButton url={shareUrl}>
                                        <RedditIcon size={40} round />
                                      </RedditShareButton>
                                      <LinkedinShareButton url={shareUrl}>
                                        <LinkedinIcon size={40} round />
                                      </LinkedinShareButton>
                                      <TelegramShareButton url={shareUrl}>
                                        <TelegramIcon size={40} round />
                                      </TelegramShareButton>
                                      <EmailShareButton url={shareUrl}>
                                        <EmailIcon size={40} round />
                                      </EmailShareButton>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>
                <div className="ml-2">
                  <DarkModeButton />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="static">
          {toggleSidebar === true ? (
            <button
              type="button"
              onClick={handleToggle}
              className=" fixed top-32 right-0 z-30 bg-dark-main p-2"
            >
              <ArrowLeftIcon className="h-6 w-6 text-white" />
            </button>
          ) : (
            <div />
          )}

          {/* Static sidebar for desktop */}
          <div id="static-sidebar" className="hidden md:flex">
            <div className="absolute right-0 flex md:fixed md:inset-y-0 md:w-80 md:flex-col">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="border-gray-350 flex flex-grow flex-col overflow-y-auto border-l  pt-5 dark:border-dark-second dark:bg-dark-main">
                <div className="mt-6 flex flex-grow flex-col">
                  <WatchList
                    id={id}
                    setId={setId}
                    fetchViewedEpisodes={fetchViewedEpisodes}
                    viewedEpisodes={viewedEpisodes}
                    setToggle={setToggleSidebar}
                    handleToggle={handleToggle}
                    details={details}
                    toggle={toggleSidebar}
                    loadingData={loadingData}
                    loadingSections={loadingSections}
                    setEpisodeQuestions={setEpisodeQuestions}
                    episodeQuestions={episodeQuestions}
                    fetchEpisodeQuestions={fetchEpisodeQuestions}
                    sections={sections && sections}
                    setSrc={setSrc && setSrc}
                    setVideoHidden={setVideoHidden && setVideoHidden}
                    videoHidden={videoHidden}
                    content={content}
                    setContent={setContent && setContent}
                    setTitle={setTitle && setTitle}
                    title={title}
                    setEpisode={setEpisode && setEpisode}
                    setResources={setResources && setResources}
                    handleQuestionHidden={handleQuestionHidden}
                    questionHidden={questionHidden}
                    setQuestionHidden={setQuestionHidden}
                    handleResourceHidden={handleResourceHidden}
                    resourceHidden={resourceHidden}
                    setResourceHidden={setResourceHidden && setResourceHidden}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video Content           */}
          <div id="video-content" className="flex flex-1 flex-col md:pr-80">
            <main className="flex-1">
              <div className="mx-auto max-w-full ">
                {/* Replace with your content */}
                {loadingData ? (
                  <div className="grid w-full place-items-center py-16">
                    <CircleLoader
                      className="items-center justify-center text-center"
                      loading={loadingData}
                      size={35}
                      color="#1c1d1f"
                    />
                  </div>
                ) : (
                  <>
                    {src && questionHidden && !videoHidden && resourceHidden === true ? (
                      <div>
                        <CustomVideo url={src} />
                        {content && content !== 'undefined' && (
                          <div
                            className="font-regular mx-4 mt-8 dark:text-dark-txt"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(content),
                            }}
                          />
                        )}
                        {tabArea()}
                      </div>
                    ) : !questionHidden && resourceHidden === true ? (
                      <>
                        <div className="grid grid-cols-12 p-4">
                          {/* Question form */}
                          <div className="col-span-12 my-4 ml-2 sm:col-span-3">
                            <form
                              onSubmit={(e) => onSubmitSearch(e)}
                              className=" flex w-full items-center rounded-full border border-gray-600 bg-gray-50 px-2 py-1  hover:border-gray-700  dark:border-none dark:border-dark-third dark:bg-dark-bg "
                            >
                              <button
                                type="button"
                                className="inline-flex w-1/12 items-center justify-center rounded-full text-xl"
                              >
                                <MagnifyingGlassIcon
                                  className="h-5 w-5 text-gray-700 dark:text-dark-txt hover:dark:text-dark-txt"
                                  aria-hidden="true"
                                />
                              </button>
                              <input
                                autoComplete="off"
                                required
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search question"
                                className="w-10/12 border-none bg-transparent py-1 text-sm font-light text-gray-600 outline-none hover:placeholder-gray-400 focus:border-none focus:border-gray-50 focus:text-gray-600 focus:placeholder-gray-400 focus:outline-none focus:ring-gray-50 dark:focus:ring-dark-second"
                              />
                            </form>
                            <button
                              type="button"
                              onClick={() => setOpenModal(true)}
                              className="my-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-100 py-3 text-center text-base font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Ask Question
                            </button>
                            <Transition.Root show={openModal} as={Fragment}>
                              <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
                                <Transition.Child
                                  as={Fragment}
                                  enter="ease-out duration-300"
                                  enterFrom="opacity-0"
                                  enterTo="opacity-100"
                                  leave="ease-in duration-200"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </Transition.Child>

                                <div className="fixed inset-0 z-10 overflow-y-auto">
                                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                      as={Fragment}
                                      enter="ease-out duration-300"
                                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                                      leave="ease-in duration-200"
                                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg  px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-dark-main sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <form
                                          onSubmit={(e) => onSubmit(e)}
                                          className="relative px-2"
                                        >
                                          <div className="overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                            <input
                                              type="text"
                                              name="questionTitle"
                                              value={questionTitle}
                                              onChange={(e) => onChange(e)}
                                              id="question_title"
                                              className="block w-full rounded-t border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0 dark:bg-dark-bg dark:text-dark-txt"
                                              placeholder="Titulo de Pregunta"
                                              required
                                            />

                                            <textarea
                                              rows={2}
                                              name="questionBody"
                                              value={questionBody}
                                              onChange={(e) => onChange(e)}
                                              id="description"
                                              required
                                              className="block w-full resize-none rounded-b border-0 py-0 placeholder-gray-500 focus:ring-0 dark:bg-dark-bg dark:text-dark-txt sm:text-sm"
                                              placeholder="Escribe tu pregunta..."
                                              defaultValue=""
                                            />

                                            {/* Spacer element to match the height of the toolbar */}
                                            <div aria-hidden="true">
                                              <div className="py-2">
                                                <div className="h-9" />
                                              </div>
                                              <div className="h-px" />
                                              <div className="py-2">
                                                <div className="py-px">
                                                  <div className="h-9" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="absolute inset-x-px bottom-0">
                                            <div className="float-right flex items-center justify-between space-x-3 px-2 py-2 sm:px-3">
                                              <div className="flex-shrink-0">
                                                <button
                                                  type="submit"
                                                  onClick={() => setOpenModal(false)}
                                                  className=" inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                                                >
                                                  Crear Pregunta
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </Dialog.Panel>
                                    </Transition.Child>
                                  </div>
                                </div>
                              </Dialog>
                            </Transition.Root>
                          </div>
                          <div className="col-span-12 sm:col-span-9">
                            {/* Questions */}
                            {/* {questions ? (
                                questions.map((question) => (
                                  <Link
                                    key={question.question_uuid}
                                    to={`/courses/study/${courseUUID}/question/${question.question_uuid}`}
                                    className="block  hover:bg-gray-100 rounded mx-2 mt-1 dark:hover:bg-dark-main dark:bg-dark-third"
                                  >
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                      <div className="min-w-0 flex-1 flex items-center">
                                        <div className="flex-shrink-0">
                                          <img
                                            className="h-12 w-12 rounded-full"
                                            src={question.user.picture}
                                            alt=""
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-blue-600 truncate">
                                              {question.title}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500">
                                              <span className="truncate">
                                                {question.user.username}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="hidden md:block">
                                            <div>
                                              {question.has_accepted_answer ? (
                                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                                  <CheckCircleIcon
                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                                    aria-hidden="true"
                                                  />
                                                  Answered
                                                </p>
                                              ) : (
                                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                                  <QuestionMarkCircleIcon
                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-rose-400"
                                                    aria-hidden="true"
                                                  />
                                                  Needs Answer
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <ChevronRightIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                ))
                              ) : (
                                <div className="w-full grid place-items-center py-16">
                                  <CircleLoader
                                    className="items-center justify-center text-center"
                                    loading={loadingData}
                                    size={35}
                                    color="#1c1d1f"
                                  />
                                </div>
                              )} */}
                            <QuestionsSec
                              setSrc={setSrc}
                              authState={authState}
                              setVideoHidden={setVideoHidden}
                              setContent={setContent}
                              setTitle={setTitle}
                              setEpisode={setEpisode}
                              setResources={setResources}
                              setQuestionHidden={setQuestionHidden}
                              episode={episode}
                              setResourceHidden={setResourceHidden}
                              episodeUUID={episodeUUID}
                              loadingQuestions={loadingQuestions}
                              questions={questions}
                              questionsCount={questionsCount}
                              fetchCourseQuestions={fetchCourseQuestions}
                              setQuestionsCount={setQuestionsCount}
                              setQuestions={setQuestions}
                              questionsPageSize={questionsPageSize}
                              setQuestionsPageSize={setQuestionsPageSize}
                              currentQuestionsPage={currentQuestionsPage}
                              setCurrentQuestionsPage={setCurrentQuestionsPage}
                              maxQuestionsPageSize={maxQuestionsPageSize}
                              setMaxQuestionsPageSize={setMaxQuestionsPageSize}
                              filterQuestionsBy={filterQuestionsBy}
                              setFilterQuestionsBy={setFilterQuestionsBy}
                              filterQuestionsByUserId={filterQuestionsByUserId}
                              setFilterQuestionsByUserId={setFilterQuestionsByUserId}
                              orderQuestionsBy={orderQuestionsBy}
                              setOrderQuestionsBy={setOrderQuestionsBy}
                              fetchEpisodeQuestions={fetchEpisodeQuestions}
                            />
                          </div>
                        </div>
                        <div />
                      </>
                    ) : resourceHidden === false ? (
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-dark-txt">
                          Recursos
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 dark:border-none dark:shadow-lg">
                            {resources && resources.some((u) => u !== null) ? (
                              resources.map((resource) => (
                                <li
                                  key={resource.id}
                                  className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                                >
                                  <div className="flex w-0 flex-1 items-center">
                                    <PaperClipIcon
                                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-2 w-0 flex-1 truncate dark:text-dark-txt">
                                      {resource.title}
                                      .zip
                                    </span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <a
                                      href={resource.file}
                                      download
                                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-dark-txt"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <div className="grid w-full place-items-center py-16">
                                <CircleLoader
                                  className="items-center justify-center text-center"
                                  loading={loadingData}
                                  size={35}
                                  color="#1c1d1f"
                                />
                              </div>
                            )}
                          </ul>
                        </dd>
                      </div>
                    ) : (
                      <>
                        {/* Details */}
                        {details ? (
                          tabArea()
                        ) : (
                          <div className="grid w-full place-items-center py-16">
                            <CircleLoader
                              className="items-center justify-center text-center"
                              loading
                              size={35}
                              color="#1c1d1f"
                            />
                          </div>
                        )}
                      </>
                    )}
                    <div />
                  </>
                )}
              </div>
            </main>
          </div>
        </div>

        <Transition.Root show={openCertificate} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpenCertificate}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                    <div className="-ml-4 mb-2 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <h3 className="text-lg font-black leading-6 text-gray-900">
                          Download certificate
                        </h3>
                      </div>
                      <div className="ml-4 mt-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setOpenCertificate(false)}
                          className="relative inline-flex "
                        >
                          <XMarkIcon className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Certificate */}
                    <div
                      id="pdf-view"
                      className="relative grid h-[560px] w-full grid-cols-12 px-4 pt-3"
                    >
                      {/* Watermark */}
                      <div
                        className="top-0 left-0 h-56 w-full md:absolute md:h-full"
                        style={{ zIndex: 0 }}
                      >
                        <img
                          width={1200}
                          height={1200}
                          src="/assets/img/placeholder/oo_watermark_beige.png"
                          className="pointer-events-none -z-10 h-full w-full select-none object-cover"
                          style={{ zIndex: 0 }}
                          alt="background"
                        />
                      </div>

                      {/* LEFT side */}
                      <div className="col-span-8 mr-2">
                        <div className=" border-green-400 h-[460px] w-full border-opacity-50 rounded-xl border-2  px-6 py-8 ">
                          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                            <div className="ml-4 ">
                              <img
                                width={256}
                                height={256}
                                alt=""
                                src="/assets/img/logos/triangle.png"
                                className="h-12 w-auto"
                              />
                            </div>
                            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                              {certificate ? <img src={qrCode} className="w-8" alt="" /> : <div />}
                            </div>
                          </div>
                          <div className="mt-12">
                            <p className=" text-sm text-gray-500">Certificate of completion</p>
                            <h3 className="my-4 text-xl font-bold leading-6 text-gray-900">
                              {certificate && certificate.title}
                            </h3>
                            <h2
                              className="text-md font-regular mb-2 text-gray-900 dark:text-dark"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  certificate && details.short_description,
                                ),
                              }}
                            />
                            <p className="flex text-sm text-gray-500">
                              Instructors:
                              <span className="ml-1 font-bold text-gray-900">
                                {certificate && certificate.instructor_first_name}{' '}
                                {certificate && certificate.instructor_last_name}
                              </span>
                              {/* <span className='font-bold ml-1 text-gray-900'>{details&&details.author.username}</span> */}
                            </p>
                            <p className="flex text-sm text-gray-500">
                              NFT Address:
                              <span className="ml-1 font-bold text-gray-900">
                                {certificate && details.nft_address}
                              </span>
                              {/* <span className='font-bold ml-1 text-gray-900'>{details&&details.author.username}</span> */}
                            </p>
                            <div className="absolute bottom-24">
                              <p className="mb-2 text-2xl font-bold text-gray-700">
                                {certificate && certificate.instructor}
                              </p>
                              <div className="-ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                                <div className="ml-4">
                                  <p className="flex text-sm text-gray-500">
                                    Date
                                    <span className="ml-2 font-bold text-gray-900">
                                      {certificate && certificate.date}
                                    </span>
                                  </p>
                                  <div className="mb-2 grid w-full grid-cols-12">
                                    <p className="col-span-4 flex text-sm text-gray-500">
                                      Length
                                      <span className="ml-2 font-bold text-gray-900">
                                        {certificate && certificate.length} total hours
                                      </span>
                                    </p>
                                    {certificate ? (
                                      <p className="col-span-8 ml-4 mt-0.5 text-xs text-gray-500">
                                        Course Token no. {details.token_id}
                                      </p>
                                    ) : (
                                      <div />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="font-regular mt-1.5 text-xs text-gray-500">
                          This certificate above certifies that{' '}
                          <span className="text-purple-600">
                            {' '}
                            {certificate && certificate.user_first_name}{' '}
                            {certificate && certificate.user_last_name}{' '}
                          </span>
                          successfully completed the course{' '}
                          <span className="text-purple-600">
                            {' '}
                            {certificate && certificate.title}{' '}
                          </span>{' '}
                          on {certificate && certificate.date} as taught by{' '}
                          <span className="text-purple-600">
                            {certificate && certificate.instructor_first_name}{' '}
                            {certificate && certificate.instructor_last_name}{' '}
                          </span>
                          on Boomslag. The certificate indicates the entire course was completed as
                          validated by the student. The course duration represents the total video
                          hours at time of most recent completion.
                        </p>
                      </div>

                      {/* RIGHT side */}
                      <div className="col-span-4 ml-2">
                        <h3 className="text-lg font-bold leading-6 text-gray-900">
                          Certificate Recipient:
                        </h3>
                        <div className="mt-2 flex">
                          <div className="mr-4 flex-shrink-0">
                            {/* <Image
                              width={256}
                              height={256}
                              className="inline-block h-14 w-14 rounded-full"
                              src={authState && authState.profile.picture}
                              alt=""
                            /> */}
                          </div>
                          <div>
                            <h4 className="text-md font-medium dark:text-dark">
                              {user.first_name} {user.last_name}
                            </h4>
                          </div>
                        </div>
                        <h3 className="mt-8 text-lg font-bold leading-6 text-gray-900">
                          About the course:
                        </h3>
                        <div className="-ml-3.5 flex flex-col justify-center">
                          <div className="relative flex w-72   max-w-xs flex-col space-y-1 rounded-xl p-3 ">
                            {/* Image */}
                            <div className="grid w-full place-items-center">
                              {/* <Image
                                width={256}
                                height={256}
                                src={certificate && certificate.thumbnail}
                                alt={
                                  details && details.title.length > 46
                                    ? details && details.title.slice(0, 45)
                                    : details && details.title
                                }
                                className=""
                              /> */}
                            </div>
                            <h2 className="text-md dark:text-black font-semibold">
                              {details && details.title}
                            </h2>
                            <p className="text-xs dark:text-dark text-gray-600">
                              {author.first_name} {author.last_name}
                            </p>
                            <div className="flex items-center">
                              <p className="text-yellow-500 mr-1 text-sm font-bold">
                                {details && details.student_rating} / 5
                              </p>

                              <p className="ml-1 text-sm text-gray-600">
                                ({details && details.student_rating_no})
                              </p>
                            </div>
                            <p className="text-xs text-gray-600">
                              {details && details.total_duration} total hours
                            </p>
                            <p className="text-xs font-bold text-gray-900">
                              $ {details && details.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download Cert button */}
                    <div className="float-right mt-4 flex">
                      {loadingFetchCertificate ? (
                        <CircleLoader
                          loading={loadingFetchCertificate}
                          className="inline-flex"
                          size={20}
                          color="#1e1f48"
                        />
                      ) : (
                        <>
                          {loadingCertificate ? (
                            <CircleLoader
                              loading={loadingCertificate}
                              className="inline-flex"
                              size={20}
                              color="#1e1f48"
                            />
                          ) : (
                            <>
                              {certificate || certificateGenerated ? (
                                <div />
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleGenerateCertificate}
                                  className="px-6 py-2 text-dark hover:text-purple-600"
                                >
                                  1) Generate certificate
                                </button>
                              )}

                              {certificate && !qrGenerated && (
                                <button
                                  type="button"
                                  onClick={generateQRCode}
                                  className="px-6 py-2 text-dark hover:text-purple-600"
                                >
                                  2) Generate QRCode
                                </button>
                              )}

                              {certificateGenerated && (
                                <button
                                  type="button"
                                  onClick={generateQRCode}
                                  className="px-6 py-2 text-dark hover:text-purple-600"
                                >
                                  2) Generate QRCode
                                </button>
                              )}
                              {certificate && qrGenerated ? (
                                <button
                                  type="button"
                                  onClick={pdfDownload}
                                  className="bg-dark-main px-6 py-2 text-white"
                                >
                                  Download
                                </button>
                              ) : (
                                // <div className='flex'>
                                //     <ArrowPathIcon  className='h-5 w-5'/>
                                // </div>
                                <div className="inline-flex select-none bg-gray-200 px-6 py-2 text-gray-700">
                                  Download
                                </div>
                              )}
                            </>
                          )}
                          <div />
                        </>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
}

CourseWatch.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

const fetchVerifyTokenOwnership = async (polygonAddress, nftAddress, ticketId, access) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_PAYMENT_URL}/api/crypto/verify_ticket_ownership/`,
      {
        polygon_address: polygonAddress,
        nft_address: nftAddress,
        ticket_id: ticketId,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
        },
      },
    );
    return response.data.results;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fetchAuthenticatedUser = async (access) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/users/me/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${access}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function getServerSideProps(context) {
  const { courseUUID } = context.query;
  const cookies = cookie.parse(context.req.headers.cookie || '');

  // Read the JWT token from the cookie
  const { access, polygonAddress } = cookies;

  // Check if username is defined
  if (!courseUUID || courseUUID.length === 0) {
    return {
      notFound: true,
    };
  }

  const courseRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_COURSES_URL}/api/courses/get/${courseUUID}/`,
  );

  const authorId = courseRes.data.results.details.author;
  const authorProfileRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get/profile/${authorId}/`,
  );

  const authorRes = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/users/get/${authorId}/`,
  );

  const nftAddress = courseRes.data.results.details.nft_address;
  const ticketId = courseRes.data.results.details.token_id;

  const user = await fetchAuthenticatedUser(access);

  const isTokenOwner = await fetchVerifyTokenOwnership(
    polygonAddress,
    nftAddress,
    ticketId,
    access,
  );

  // Check if the user is not the author, and if not, then check if they have the ticket
  if (authorId !== user.id && !isTokenOwner) {
    return {
      redirect: {
        destination: `/course/${courseRes.data.results.details.slug}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      courseUUID,
      access,
      course: courseRes.data.results,
      authorProfile: authorProfileRes.data.results,
      author: authorRes.data.results,
      isTokenOwner,
      user,
    },
  };
}
