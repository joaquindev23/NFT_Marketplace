import React from 'react';
import FriendRequestCard from './FriendRequestCard';

export default function FriendRequestsList({ friendRequests }) {
  return (
    <div>
      {friendRequests &&
        friendRequests.length > 0 &&
        friendRequests.map((request) => <FriendRequestCard key={request.id} data={request} />)}
    </div>
  );
}
