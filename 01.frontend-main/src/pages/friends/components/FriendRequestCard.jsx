import CheckBadgeIcon from '@heroicons/react/24/solid/CheckBadgeIcon';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AcceptFriend from '@/api/friends/Accept';

export default function FriendRequestCard({ data }) {
  const handleAcceptFriend = async () => {
    await AcceptFriend(data && data.id, true);
  };

  const handleDeclineFriend = async () => {
    await AcceptFriend(data && data.id, false);
  };

  return (
    <div>
      <article key={data && data.id} className="flex flex-col items-start justify-between">
        <div className="max-w-xl">
          <div className="relative mt-8 flex items-center gap-x-4">
            <Image
              width={256}
              height={256}
              src={data && data.picture}
              alt=""
              className="h-10 w-10 rounded-full bg-gray-100"
            />
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                <Link href={`/@/${data && data.username}`}>
                  <span className="absolute inset-0" />
                  {data && data.username}
                  {data && data.verified && (
                    <CheckBadgeIcon className="ml-1 inline-flex h-4 w-auto text-iris-500" />
                  )}
                </Link>
              </p>
              <p className="text-gray-600">
                {data && data.first_name} {data && data.last_name}
              </p>
            </div>
          </div>
        </div>
        <div className="m-2 flex space-x-2">
          <button
            type="button"
            onClick={handleAcceptFriend}
            className="rounded bg-iris-500 py-1 px-2 text-sm font-semibold text-white shadow-sm hover:bg-iris-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDeclineFriend}
            className="rounded bg-gray-50 py-1 px-2 text-sm font-semibold text-dark shadow-sm hover:bg-gray-100"
          >
            Decline
          </button>
        </div>
      </article>
    </div>
  );
}
