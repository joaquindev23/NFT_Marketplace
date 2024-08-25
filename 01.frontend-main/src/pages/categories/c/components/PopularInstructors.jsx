import React from 'react';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import UserCard from '@/components/UserCard';

export default function PopularInstructors({ instructors }) {
  return (
    <div className="py-12 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="mb-4">
        <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-dark-txt">
          Popular Instructors
        </h3>
      </div>

      <div className="relative mt-8">
        <div className="relative -mb-6 w-full overflow-x-auto pb-6">
          <ul className="mx-4 p-1 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-x-2">
            {instructors &&
              instructors.map((user) => {
                return <UserCard key={user.id} data={user} />;
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
