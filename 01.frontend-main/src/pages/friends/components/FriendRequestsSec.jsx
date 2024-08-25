import React from 'react';
import FriendRequestsList from './FriendRequestsList';

export default function FriendRequestsSec({ friendRequests }) {
  return (
    <div>
      <div className="pb-5">
        <p className="text-xl font-bold leading-6 text-gray-900">Friend Requests</p>
      </div>
      <FriendRequestsList friendRequests={friendRequests} />
    </div>
  );
}
