import React, { useEffect } from 'react';
import InboxListItem from './InboxListItem';

export default function InboxesList({ inboxes, user, setChat, chat }) {
  return (
    <ul className="">
      {inboxes &&
        inboxes.map((inbox) => (
          <InboxListItem key={inbox.id} inbox={inbox} user={user} setChat={setChat} chat={chat} />
        ))}
    </ul>
  );
}
