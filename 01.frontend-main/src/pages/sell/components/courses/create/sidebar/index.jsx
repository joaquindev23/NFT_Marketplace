import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { AcademicCapIcon, ShoppingCartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { setCourseLandingPage } from '@/redux/actions/create/create';
import { useRouter } from 'next/router';

export default function Sidebar({ course, courseUUID }) {
  const router = useRouter();

  const whoIsFor = course && course.who_is_for;
  const requisites = course && course.requisites;
  const whatlearnt = course && course.whatlearnt;
  const details = course && course.details;

  const readCourseStructure = useSelector((state) => state.create.read_course_structure);
  const readCourseSetup = useSelector((state) => state.create.read_course_setup);
  const readCourseFilm = useSelector((state) => state.create.read_course_film);

  const goals = course && course.details && course && course.details.goals;
  const courseStructure = course && course.details && course && course.details.course_structure;
  const setup = course && course.details && course && course.details.setup;
  const film = course && course.details && course && course.details.film;
  const curriculum = course && course.details && course && course.details.curriculum;
  const accessibility = course && course.details && course && course.details.accessibility;
  const landingPage = course && course.details && course && course.details.landing_page;
  const pricing = course && course.details && course && course.details.pricing;
  const promotions = course && course.details && course && course.details.promotions;
  const allowMessages = course && course.details && course && course.details.allow_messages;

  const plan = [
    // { name: 'Dashboard', href: '/instructor/dashboard', icon: HomeIcon, current: router.pathname === "/instructor/dashboard" ? true:false },
    {
      id: 1,
      uuid: '7cc5e209-10b5-4604-90ba-c7311dd74214',
      name: 'Intended learners',
      href: `/sell/courses/manage/goals/${courseUUID}`,
      icon: AcademicCapIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/goals/`),
      ready: goals,
    },

    {
      id: 2,
      uuid: 'd363dae0-622f-4194-b91a-8d72e19d76bd',
      name: 'Course structure',
      href: `/sell/courses/manage/course_structure/${courseUUID}`,
      icon: ChatBubbleLeftIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/course_structure/`),
      ready: readCourseStructure || courseStructure,
    },
    {
      id: 3,
      uuid: '004666d1-1f72-4f22-bad2-c685362fbc93',
      name: 'Setup & test video',
      href: `/sell/courses/manage/setup/${courseUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/setup/`),
      ready: readCourseSetup || setup,
    },
  ];

  const create = [
    // { name: 'Dashboard', href: '/instructor/dashboard', icon: HomeIcon, current: router.pathname === "/instructor/dashboard" ? true:false },
    {
      id: 1,
      uuid: '6b029a53-6124-4992-9702-3f900b1c27eb',
      name: 'Film & Edit',
      href: `/sell/courses/manage/film/${courseUUID}`,
      icon: AcademicCapIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/film/`),
      ready: readCourseFilm || film,
    },
    {
      id: 2,
      uuid: '463b7572-cea4-4fa4-a88d-4f5c92d695ed',
      name: 'Curriculum',
      href: `/sell/courses/manage/curriculum/${courseUUID}`,
      icon: ChatBubbleLeftIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/curriculum/`),
      ready: curriculum,
    },
    // {
    //     id: 3,
    //     uuid: '7e25b991-8955-4dbf-95f7-981e91162416',
    //     name: 'Captions',
    //     href: `/sell/courses/manage/captions/${course_uuid}`,
    //     icon: ShoppingCartIcon, current: router.pathname === `/sell/courses/manage/captions/${course_uuid}` ? true:false,
    //     ready: captions
    // },
    {
      id: 4,
      uuid: 'ad18d088-3f98-4d89-ab13-292f7103893e',
      name: 'Accessibility',
      href: `/sell/courses/manage/accessibility/${courseUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/accessibility/`),
      ready: accessibility,
    },
  ];

  const publish = [
    // { name: 'Dashboard', href: '/instructor/dashboard', icon: HomeIcon, current: router.pathname === "/instructor/dashboard" ? true:false },
    {
      id: 1,
      uuid: '7a87e3b9-4c85-41d4-8047-d039b347918f',
      name: 'Course Landing Page',
      href: `/sell/courses/manage/basics/${courseUUID}`,
      icon: AcademicCapIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/basics/`),
      ready: landingPage,
    },
    {
      id: 2,
      uuid: 'c73676e5-827c-4675-8459-ef3e3a9c5708',
      name: 'Pricing',
      href: `/sell/courses/manage/pricing/${courseUUID}`,
      icon: ChatBubbleLeftIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/pricing/`),
      ready: pricing,
    },
    {
      id: 3,
      uuid: 'd5988edd-8fa3-407e-a932-abe6c57e64fa',
      name: 'Promotions',
      href: `/sell/courses/manage/promotions/${courseUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/promotions/`),
      ready: promotions,
    },
    {
      id: 4,
      uuid: '7a70be3f-89b6-4c7e-a878-7e8364101677',
      name: 'Course Messages',
      href: `/sell/courses/manage/messages/${courseUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname.startsWith(`/sell/courses/manage/messages/`),
      ready: allowMessages,
    },
  ];

  useEffect(() => {
    if (details) {
      setCourseLandingPage(details && details.id, true);
    }
  }, [details]);

  return (
    <div className="w-full p-6 ">
      <div className="lg:pt-16" />
      <div className="ml-6">
        <p className="text-md ml-4 font-black leading-6 dark:text-dark-txt text-gray-900">
          Plan your course
        </p>
      </div>
      <ul className="mt-2">
        {plan.map((item) => (
          <Link key={item.uuid} href={item.href}>
            <li
              className={`${
                item.current
                  ? 'border-l-4 border-gray-900 dark:border-dark-border'
                  : 'border-l-6 border-transparent'
              } cursor-pointer py-3 dark:hover:bg-dark-second hover:bg-gray-50 `}
            >
              {/* Your content */}
              <div className="ml-4 flex">
                {/* <i class='bx bx-radio-circle text-2xl inline-flex text-gray-700'></i> */}
                {/* <div className='border p-1.5 px-3 border-gray-500 rounded-full relative'>
                          <i className='bx bx-check absolute top-3  left-4 transform -translate-x-1/2 -translate-y-1/2 w-full h-full '></i>
                      </div> */}
                {item.ready ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-forest-green-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}

                <p className="ml-3 dark:text-dark-txt-secondary">{item.name}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <div className="mt-8" />

      <div className="ml-6">
        <p className="text-md ml-4 font-black leading-6 dark:text-dark-txt text-gray-900">
          Create your content
        </p>
      </div>
      <ul className="mt-2">
        {create.map((item) => (
          <Link key={item.uuid} href={item.href}>
            <li
              className={`${
                item.current
                  ? 'border-l-4 border-gray-900 dark:border-dark-border'
                  : 'border-l-6 border-transparent'
              } cursor-pointer py-3 dark:hover:bg-dark-second hover:bg-gray-50 `}
            >
              {/* Your content */}
              <div className="ml-4 flex">
                {/* <i class='bx bx-radio-circle text-2xl inline-flex text-gray-700'></i> */}
                {/* <div className='border p-1.5 px-3 border-gray-500 rounded-full relative'>
                          <i className='bx bx-check absolute top-3 left-4 transform -translate-x-1/2 -translate-y-1/2 w-full h-full '></i>
                      </div> */}
                {item.ready ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-forest-green-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <p className="ml-3 dark:text-dark-txt-secondary">{item.name}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <div className="mt-8" />

      <div className="ml-6">
        <p className="text-md ml-4 font-black leading-6 dark:text-dark-txt text-gray-900">
          Publish course
        </p>
      </div>
      <ul className="mt-2">
        {publish.map((item) => (
          <Link key={item.uuid} href={item.href}>
            <li
              className={`${
                item.current
                  ? 'border-l-4 border-gray-900 dark:border-dark-border'
                  : 'border-l-6 border-transparent'
              } cursor-pointer py-3 dark:hover:bg-dark-second hover:bg-gray-50 `}
            >
              {/* Your content */}
              <div className="ml-4 flex">
                {/* <i class='bx bx-radio-circle text-2xl inline-flex text-gray-700'></i> */}
                {/* <div className='border p-1.5 px-3 border-gray-500 rounded-full relative'>
                          <i className='bx bx-check absolute top-3 left-4 transform -translate-x-1/2 -translate-y-1/2 w-full h-full '></i>
                      </div> */}
                {item.ready ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-forest-green-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <p className="ml-3 dark:text-dark-txt-secondary">{item.name}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
