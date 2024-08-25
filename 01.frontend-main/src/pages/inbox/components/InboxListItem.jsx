import React, { useCallback, useEffect, useState } from 'react';
import GetUserInfo from '@/api/chat/GetUserInfo';
import LoadConversation from '@/api/chat/LoadConversation';

export default function InboxListItem({ inbox, user, setChat }) {
  const [userInfo, setUserInfo] = useState({ username: '', profile: '' });
  const [isSelected, setIsSelected] = useState(false);

  const fetchUser = useCallback(async () => {
    if (inbox && inbox.participants && user) {
      const participant = inbox.participants.find((u) => u.uuid !== user.id);
      if (participant) {
        const res = await GetUserInfo(participant.uuid);
        setUserInfo(res.data.results);
      }
    }
  }, [inbox, user]);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const loadConversationHandler = async () => {
    const res = await LoadConversation(inbox.room_name, inbox.room_group_name);
    if (res.status === 200) {
      setChat(res.data.results);
      setIsSelected(true); // Set the selection state to true
    }
  };

  return (
    <button
      type="button"
      onClick={loadConversationHandler}
      key={inbox && inbox.id}
      className={`flex w-full cursor-pointer py-4 px-3 ${
        isSelected ? 'bg-white' : 'bg-gray-100'
      } hover:bg-white`}
    >
      {userInfo.picture ? (
        <img className="h-10 w-10 rounded-full" src={userInfo.profile} alt="" />
      ) : null}
      <div className="ml-6">
        <p className="text-sm font-medium text-gray-900">
          Inbox with {userInfo.username ? userInfo.username : 'Unknown User'}
        </p>
        <p className="text-sm text-gray-500">
          {inbox && inbox.last_message ? inbox.last_message.slice(0, 19) : 'New Conversation'}
        </p>
      </div>
    </button>
  );
}
