import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import moment from 'moment';
import {
  PaperClipIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon,
  LockClosedIcon,
  PencilIcon,
  ArrowUturnLeftIcon,
  HashtagIcon,
} from '@heroicons/react/20/solid';
import VoteRadioGroup from '../pages/inbox/components/chat/VoteRadioGroup';
import VotePoll from '@/api/chat/VotePoll';

const moods = [
  {
    name: 'Excited',
    value: 'excited',
    icon: FireIcon,
    iconColor: 'text-white',
    bgColor: 'bg-rose-500',
  },
  {
    name: 'Loved',
    value: 'loved',
    icon: HeartIcon,
    iconColor: 'text-white',
    bgColor: 'bg-pink-400',
  },
  {
    name: 'Happy',
    value: 'happy',
    icon: FaceSmileIcon,
    iconColor: 'text-white',
    bgColor: 'bg-forest-green-400',
  },
  {
    name: 'Sad',
    value: 'sad',
    icon: FaceFrownIcon,
    iconColor: 'text-white',
    bgColor: 'bg-almond-700',
  },
  {
    name: 'Thumbsy',
    value: 'thumbsy',
    icon: HandThumbUpIcon,
    iconColor: 'text-white',
    bgColor: 'bg-blue-300',
  },
  {
    name: 'I feel nothing',
    value: null,
    icon: XMarkIcon,
    iconColor: 'text-gray-400',
    bgColor: 'bg-transparent',
  },
];

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const allowedVideoTypes = ['video/mpeg', 'video/mp4', 'video/quicktime', 'video/x-ms-wmv'];
const allowedFileTypes = [
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Message({ message, chat, user, myParticipant, otherParticipants }) {
  // console.log(message);

  const [showMenu, setShowMenu] = useState(false);

  const sender =
    chat &&
    chat.participants &&
    chat.participants.find((participant) => participant.uuid === message.sender.uuid);
  const senderId = sender && sender.uuid.toString();
  const userId = user && user.id.toString();
  const isMyMessage = senderId === userId;

  const senderParticipant = isMyMessage
    ? user
    : otherParticipants &&
      otherParticipants.find((participant) => participant.id === message.sender.uuid);

  const msgSender = {
    id: senderParticipant && senderParticipant.id,
    username: senderParticipant && senderParticipant.username,
    picture: senderParticipant && senderParticipant.picture,
  };

  const getMessageMood = (messageMood) => {
    return moods.find((mood) => mood.value === messageMood);
  };

  const [messageMood, setMessageMood] = useState(null);
  useEffect(() => {
    if (message && message.mood) {
      setMessageMood(getMessageMood(message && message.mood));
    }
  }, [message]);

  const handleVote = async (option) => {
    // console.log('Vote on Poll ere', option);
    const res = await VotePoll(message.poll.id, option, chat && chat.id);
    console.log(res);
  };

  return (
    <div className={`flex w-full ${isMyMessage ? 'flex-row-reverse' : 'items-start'}`}>
      <Link href={isMyMessage ? `/@${myParticipant?.username}` : `/@${msgSender?.username}`}>
        <Image
          width={256}
          height={256}
          className="mx-2 inline-block h-8 w-8 rounded-full"
          src={isMyMessage ? myParticipant?.picture : msgSender?.picture}
          alt=""
        />
      </Link>

      <div
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
        className="relative flex flex-col space-y-1"
      >
        {showMenu && (
          <div className="absolute -top-4 right-0 z-10 space-x-2 rounded-md bg-gray-50 py-1 px-2 shadow-md">
            <FaceSmileIcon className=" inline-block h-4 w-auto cursor-pointer text-gray-500 hover:text-gray-700" />
            {message.encryption !== 'none' && (
              <LockClosedIcon className=" inline-block h-4 w-auto cursor-pointer text-gray-500 hover:text-gray-700" />
            )}
            {isMyMessage && (
              <PencilIcon className=" inline-block h-4 w-auto cursor-pointer text-gray-500 hover:text-gray-700" />
            )}
            <ArrowUturnLeftIcon className=" inline-block h-4 w-auto cursor-pointer text-gray-500 hover:text-gray-700" />
            <HashtagIcon className=" inline-block h-4 w-auto cursor-pointer text-gray-500 hover:text-gray-700" />
          </div>
        )}
        {message && message.content && message.content.length > 0 && (
          <>
            {message.encryption === 'none' ? (
              <div
                className={`max-w-xs break-all rounded ${
                  isMyMessage ? 'bg-blue-200 text-white' : 'bg-gray-200'
                } p-5`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }}
              />
            ) : (
              <div
                className={`max-w-xs break-all rounded ${
                  isMyMessage ? 'bg-blue-200 text-white ' : 'bg-gray-200 '
                } p-5`}
              >
                <span className="font-bold">Encrypted message: </span>
                {message.encryption}
              </div>
            )}
            <div />
          </>
        )}
        message &&
        {message.gif && (
          <Image
            width={256}
            height={256}
            src={message.gif.url}
            alt={message.gif.title}
            className="h-32 w-full rounded-lg object-contain"
          />
        )}
        {message && message.poll && <VoteRadioGroup poll={message.poll} onVote={handleVote} />}
        {message && message.voice_message && <audio src={message.voice_message} controls />}
        {/* Display Attached Images */}
        {message.files && message.files.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center">
            {message.files
              .filter((file) => allowedImageTypes.includes(file.mime_type))
              .slice(0, 4)
              .map((file) => (
                <Link
                  href={file.file}
                  download={file.name}
                  key={file.id}
                  className="m-1 w-1/4"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    width={256}
                    height={256}
                    src={file.file}
                    alt={file.name}
                    className="h-auto w-full rounded-sm object-cover"
                  />
                </Link>
              ))}
          </div>
        )}
        {message && message.files && message.files.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center">
            {message.files
              .filter((file) => allowedFileTypes.includes(file.mime_type))
              .map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                >
                  <div className="mr-2 flex w-0 flex-1 items-center">
                    <PaperClipIcon
                      className=" h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-2 w-0 flex-1 truncate">{file.name}</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {allowedFileTypes.includes(file.mime_type) ? (
                      <Link
                        // type="button"
                        href={file.url}
                        download={file.name}
                        className="cursor-pointer font-medium text-iris-600 hover:text-iris-500"
                      >
                        {file.name}
                      </Link>
                    ) : (
                      <span className="text-red-500">File type not accepted</span>
                    )}
                  </div>
                </li>
              ))}
          </div>
        )}
        {message && message.files && message.files.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center">
            {message.files
              .filter(
                (file) =>
                  allowedVideoTypes.includes(file.mime_type) || file.mime_type.startsWith('video/'),
              )
              .slice(0, 4)
              .map((file) => (
                <Link
                  href={file.file}
                  download={file.name}
                  key={file.id}
                  className=""
                  target="_blank"
                  rel="noreferrer"
                >
                  {file.mime_type.startsWith('video/') ? (
                    <video className="h-auto w-full rounded-sm object-cover" controls>
                      <source src={file.file} type={file.mime_type} />
                      {/* <track
                        label="English"
                        kind="subtitles"
                        srcLang="en"
                        src="subtitles_en.vtt"
                        default
                      /> */}
                      {/* <track kind="descriptions" src="descriptions_en.vtt" /> */}
                    </video>
                  ) : (
                    <Image
                      width={256}
                      height={256}
                      src={file.file}
                      alt={file.name}
                      className="h-auto w-full rounded-sm object-cover"
                    />
                  )}
                </Link>
              ))}
          </div>
        )}
        <div className="flex">
          {messageMood && (
            <span className="pr-1 pt-1">
              <span
                className={classNames(
                  messageMood.bgColor,
                  'flex h-5 w-5 items-center justify-center rounded-full',
                )}
              >
                <messageMood.icon className="h-3 w-3 flex-shrink-0 text-white" aria-hidden="true" />
              </span>
              <span className="sr-only">{messageMood.name}</span>
            </span>
          )}
          <div className="text-sm text-gray-600 dark:text-dark-txt">
            {moment(message && message.timestamp).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
}
