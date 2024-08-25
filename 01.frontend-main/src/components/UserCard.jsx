import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function UserCard({ data }) {
  const {
    address = '0xaeb5e8Bd91D35f2f30733f945F39D45141B7Bc31',
    email = 'example@domain.com',
    first_name = 'First name',
    id = 'a9d1ee5e-8310-4925-825d-840d6ab5f924',
    is_online = false,
    last_name = 'Last name',
    picture = 'https://boomslagauth.s3.us-east-2.amazonaws.com/users/user_default_profile.png',
    polygon_address = '0xD63794Cdad6AbDB077661F93241Dc217f0f9D865',
    rating = null,
    slug = 'username',
    total_earnings = '0.00',
    username = 'username',
    verified = false,
    student_rating = 0,
    student_rating_no = 0,
    students = 0,
    courses = 0,
    products = 0,
  } = data ?? {};

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex w-64 flex-col text-center lg:w-full border-2 border-dark-bg dark:border-dark-second dark:bg-dark-bg bg-white dark:shadow-none shadow-neubrutalism-md transition duration-300 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neubrutalism-xl"
    >
      <div className="group relative">
        {/* Image */}
        <div className="relative grid w-full place-items-center">
          <Image
            width={512}
            height={512}
            id={`img-shadow${id}`}
            src={picture}
            alt={`${first_name} ${last_name}`}
            className="object-cover h-40"
          />
          <div
            id={`img-shadow${id}`}
            className="bg-gray-350 absolute inset-0 mix-blend-multiply"
            aria-hidden="true"
          />
        </div>
        <div className="flex w-full text-left flex-col space-y-1 p-3">
          {/* Name */}
          <Link
            href={`/@/${username}`}
            className={`text-md justify-start text-left font-bold  ${
              hover ? 'text-iris-500 dark:text-dark-primary' : 'text-gray-800 dark:text-dark-txt'
            }`}
          >
            {username}
          </Link>
          {/* Username */}
          <p className="select-none text-sm dark:text-dark-txt-secondary text-gray-500">
            @{username}
          </p>
          {/* Rating */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-almond-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="ml-1 select-none text-sm font-bold dark:text-dark-txt-secondary text-gray-600">
              {student_rating}
              <span className="font-normal dark:text-dark-txt text-gray-500">
                {' '}
                ({student_rating_no} reviews)
              </span>
            </p>
          </div>
          {/* Additional Info */}
          <div className="flex justify-between text-sm dark:text-dark-txt-secondary text-gray-500">
            <p>{courses} courses</p>
            <p>{products} products</p>
            <p>{students} students</p>
          </div>
          {/* Total Earnings */}
          {/* <p className="select-none text-md dark:text-dark-txt-secondary text-gray-800">
            Total Earnings: ${total_earnings}
          </p> */}
          {/* <p className=" text-xs dark:text-dark-txt-secondary text-gray-800">
            Ethereum Address: {address}
          </p> */}
          {/* <p className=" text-xs dark:text-dark-txt-secondary text-gray-800">
            Polygon Address: {polygon_address}
          </p> */}
        </div>
      </div>
    </li>
  );
}
