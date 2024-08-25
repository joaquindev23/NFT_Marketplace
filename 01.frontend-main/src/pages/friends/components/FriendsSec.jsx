import React from 'react';
import FriendsList from './FriendsList';

export default function FriendsSec({ friendList }) {
  return (
    <div>
      <div className="pb-5">
        <p className="text-xl font-bold leading-6 text-gray-900">Your Friends</p>
      </div>
      <FriendsList friendList={friendList} />
    </div>
  );
}
