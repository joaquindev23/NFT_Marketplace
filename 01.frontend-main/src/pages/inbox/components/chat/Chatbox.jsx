import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition, Menu } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import forge from 'node-forge';
import { ntru } from 'ntru';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
  GifIcon,
  ChevronDownIcon,
  ScaleIcon,
  MicrophoneIcon,
  PhoneIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { useDropzone } from 'react-dropzone';
import TrashIcon from '@heroicons/react/20/solid/TrashIcon';
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon';

import SimpleEditor from '@/components/SimpleEditor';
import { ToastError } from '@/components/ToastError';
import SendMessage from '@/api/chat/SendMessage';
import { ToastSuccess } from '@/components/ToastSuccess';
import GIFSelection from './GIFSelection';
import VoiceRecorder from './VoiceRecorder';
import CreatePollSec from './CreatePollSec';
import StartVideoCall from './video/StartVideoCall';
import EndVideoCall from './video/EndVideoCall';

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const allowedVideoTypes = ['video/mpeg', 'video/mp4', 'video/quicktime', 'video/x-ms-wmv'];
const allowedFileTypes = [
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
];

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

const encryptionOptions = [
  {
    name: 'Strongest',
    value: 'lattice_based',
    icon: LockClosedIcon,
    iconColor: 'text-white',
    bgColor: 'bg-gray-500',
  },
  {
    name: 'Very Strong',
    value: 'rsa_plus_base64',
    icon: LockClosedIcon,
    iconColor: 'text-white',
    bgColor: 'bg-gray-500',
  },
  {
    name: 'No encryption',
    value: null,
    icon: XMarkIcon,
    iconColor: 'text-gray-400',
    bgColor: 'bg-transparent',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Chatbox({
  roomName,
  roomGroupName,
  isInVideoCall,
  onStartVideoCall,
  user,
  stream,
  peerConnections,
  websocketVideoClientRef,
  createPeerConnection,
}) {
  const [messageId, setMessageId] = useState(uuidv4());

  const [pollQuestion, setPollQuestion] = useState('');
  const [poll, setPoll] = useState(null);
  const [pollOptions, setPollOptions] = useState([{ text: '', checked: false }]);

  const [audioURL, setAudioURL] = useState(null);

  const [selectedGif, setSelectedGif] = useState(false);
  const [gifs, setGifs] = useState([]);

  const [selected, setSelected] = useState(moods[5]);
  const [selectedEncryption, setSelectedEncryption] = useState(encryptionOptions[2]);
  const [messageBody, setMessageBody] = useState('');

  const [publicKeyToSend, setPublicKeyFile] = useState(null);
  const [privateKeyToSend, setPrivateKeyFile] = useState(null);
  const [isPrivateKeyDownloaded, setIsPrivateKeyDownloaded] = useState(false);

  // This gives a maximum of 61 characters.
  const MAX_RSA_MESSAGE_LENGTH = Math.floor(245 / 4); // Rounded down to nearest integer

  // This gives a maximum of 257 characters.
  const MAX_LATTICE_MESSAGE_LENGTH = Math.floor(1031 / 4); // Rounded down to nearest integer

  const [files, setFiles] = useState([]);
  const MAX_FILE_COUNT = 5; // Maximum number of files allowed per upload

  const handleAcceptedFiles = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > MAX_FILE_COUNT) {
      ToastError(`You can only upload up to ${MAX_FILE_COUNT} files at a time.`);
      return;
    }

    const newFiles = acceptedFiles.filter((file) => {
      if (allowedImageTypes.includes(file.type) && file.size <= 6 * 1024 * 1024) {
        // 6MB maximum filesize
        return true;
      }
      if (allowedVideoTypes.includes(file.type) && file.size <= 2 * 1024 * 1024 * 1024) {
        // 2GB maximum filesize
        return true;
      }
      if (allowedFileTypes.includes(file.type) && file.size <= 1 * 1024 * 1024 * 1024) {
        // 1GB maximum filesize
        return true;
      }

      let errorMessage = '';
      if (!allowedFileTypes.includes(file.type)) {
        errorMessage = `File type not accepted: ${file.type}. `;
      }
      if (file.size > 1 * 1024 * 1024 * 1024) {
        errorMessage += `File size too large: ${file.size}.`;
      } else if (!errorMessage) {
        errorMessage = `File "${file.name}" is too large.`;
      }

      ToastError(errorMessage);
      return false;
    });

    const uniqueNewFiles = newFiles.filter((newFile) => {
      const found = files.some((file) => file.name === newFile.name && file.size === newFile.size);
      return !found;
    });

    setFiles([...files, ...uniqueNewFiles]);
  };

  const handleRemoveFile = (fileIndex) => {
    const newFiles = files.filter((file, index) => index !== fileIndex);
    setFiles(newFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: [...allowedImageTypes, ...allowedVideoTypes, ...allowedFileTypes],
    onDrop: handleAcceptedFiles,
    multiple: true,
  });

  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const generateRSAKeyPair = () => {
    try {
      const keys = forge.pki.rsa.generateKeyPair(2048);
      const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
      const publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey);
      return { privateKeyPem, publicKeyPem };
    } catch (error) {
      console.error(error);
      ToastError('Error generating RSA key pair');
      return null;
    }
  };

  const [keyGenerated, setKeyGenerated] = useState(false);

  const encryptFiles = async (publicKey) => {
    let encryptedFiles;
    if (selectedEncryption.value === 'rsa_plus_base64') {
      // Encrypt files using RSA
      encryptedFiles = await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          return new Promise((resolve, reject) => {
            reader.onloadend = () => {
              try {
                const fileContent = reader.result;
                const encrypted = publicKey.encrypt(fileContent);
                const base64 = forge.util.encode64(encrypted);
                const encryptedFile = new File([base64], file.name, { type: file.type });
                resolve(encryptedFile);
              } catch (error) {
                reject(error);
              }
            };
          });
        }),
      );
    } else if (selectedEncryption.value === 'lattice_based') {
      // Encrypt files using lattice-based encryption
      encryptedFiles = await Promise.all(
        files.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const encrypted = await ntru.encrypt(publicKey, buffer);
          const encryptedArray = new Uint8Array(encrypted);
          const encryptedFile = new File([encryptedArray], file.name, { type: file.type });
          return encryptedFile;
        }),
      );
    }
    return encryptedFiles;
  };

  const encryptMessage = async (publicKey, message) => {
    let encryptedMessage;

    if (selectedEncryption.value === 'rsa_plus_base64') {
      // Encrypt message using RSA
      const messageBytes = forge.util.encodeUtf8(message);
      const encrypted = publicKey.encrypt(messageBytes);
      encryptedMessage = forge.util.encode64(encrypted);
    } else if (selectedEncryption.value === 'lattice_based') {
      const messageBytes = new TextEncoder().encode(messageBody);
      const encrypted = await ntru.encrypt(publicKey, messageBytes);
      const base64 = btoa(String.fromCharCode(...encrypted.cyphertext));
      encryptedMessage = base64;
    }

    return encryptedMessage;
  };

  const handleDownloadPrivateKey = async () => {
    if (!privateKeyToSend && !isPrivateKeyDownloaded) {
      if (selectedEncryption.value === 'rsa_plus_base64') {
        const { publicKeyPem, privateKeyPem } = await generateRSAKeyPair();
        const publicKeyFile = new File([publicKeyPem], `public_key_${messageId}.txt`, {
          type: 'text/plain',
        });
        const privateKeyFile = new File([privateKeyPem], `private_key_${messageId}.txt`, {
          type: 'text/plain',
        });
        setPublicKeyFile(publicKeyFile);
        setPrivateKeyFile(privateKeyFile);
        setKeyGenerated(true);
      }

      if (selectedEncryption.value === 'lattice_based') {
        // Generate NTRU key pair
        const { publicKey, privateKey } = await ntru.keyPair();
        const publicKeyBytes = new TextEncoder().encode(
          JSON.stringify([...new Uint8Array(publicKey)]),
        );
        const privateKeyBytes = new TextEncoder().encode(
          JSON.stringify([...new Uint8Array(privateKey)]),
        );

        const publicKeyFile = new File([publicKeyBytes], `public_key_${messageId}.txt`, {
          type: 'text/plain',
        });
        const privateKeyFile = new File([privateKeyBytes], `private_key_${messageId}.txt`, {
          type: 'text/plain',
        });

        setPublicKeyFile(publicKeyFile);
        setPrivateKeyFile(privateKeyFile);
        setKeyGenerated(true);
      }
    }

    if (privateKeyToSend && !isPrivateKeyDownloaded) {
      const url = URL.createObjectURL(privateKeyToSend);
      const a = document.createElement('a');
      a.href = url;
      a.download = `private_key_${messageId}.txt`;
      a.click();
      setIsPrivateKeyDownloaded(true);
      setShowDownloadButton(true);
    }
  };

  const handleSendMessage = async () => {
    if (selectedEncryption.value === 'rsa_plus_base64') {
      if (!privateKeyToSend || !publicKeyToSend) {
        ToastError('Missing encryption keys');
        return;
      }

      const publicKeyPem = await publicKeyToSend.text();
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

      const encryptedMessage = await encryptMessage(publicKey, messageBody);

      const publicKeyFile = new File([publicKeyPem], `public_key.pem`);
      const formData = new FormData();
      formData.append('message', encryptedMessage);
      formData.append('roomName', roomName);
      formData.append('roomGroupName', roomGroupName);
      formData.append('mood', selected.value);
      formData.append('publicKey', publicKeyFile);
      formData.append('encryption', 'rsa');

      // Append selected gif to formData
      if (selectedGif) {
        formData.append('gif', JSON.stringify(selectedGif));
      }

      if (poll) {
        formData.append('poll', JSON.stringify(poll));
      }

      if (audioURL) {
        const blob = await fetch(audioURL).then((r) => r.blob());
        formData.append('voice_message', blob, 'voice_message.mp3');
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      // Call the API that sends files with attachments
      try {
        // Call the API that sends files with attachments
        const response = await SendMessage(formData, files);
        if (response.status === 200) {
          setMessageBody('');
          setAudioURL(null);
          setPoll(null);
          setPollQuestion('');
          setPollOptions([]);
          setPublicKeyFile(null);
          setPrivateKeyFile(null);
          setIsPrivateKeyDownloaded(false);
          setShowDownloadButton(false);
          setSelected(moods[5]);
          setSelectedEncryption(encryptionOptions[2]);
          setFiles([]);
          setSelectedGif(false);
          setKeyGenerated(false);
        }
      } catch (error) {
        console.log(error);
      }
      //   console.log(formData, roomName, roomGroupName, files);
    } else if (selectedEncryption.value === 'lattice_based') {
      if (!privateKeyToSend || !publicKeyToSend) {
        ToastError('Missing encryption keys');
        return;
      }
      const publicKeyPem = await publicKeyToSend.text();
      const publicKeyBytes = new Uint8Array(JSON.parse(publicKeyPem));
      const encryptedMessage = await encryptMessage(publicKeyBytes, messageBody);
      const publicKeyFile = new File([publicKeyPem], `public_key.txt`);

      const formData = new FormData();
      formData.append('message', encryptedMessage);
      formData.append('roomName', roomName);
      formData.append('roomGroupName', roomGroupName);
      formData.append('mood', selected.value);
      formData.append('publicKey', publicKeyFile);
      formData.append('encryption', 'lattice');

      // Append selected gif to formData
      if (selectedGif) {
        formData.append('gif', JSON.stringify(selectedGif));
      }

      if (poll) {
        formData.append('poll', JSON.stringify(poll));
      }

      if (audioURL) {
        const blob = await fetch(audioURL).then((r) => r.blob());
        formData.append('voice_message', blob, 'voice_message.mp3');
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      // Call the API that sends files with attachments
      try {
        // Call the API that sends files with attachments
        const response = await SendMessage(formData, files);
        if (response.status === 200) {
          setMessageBody('');
          setAudioURL(null);
          setPoll(null);
          setPollQuestion('');
          setPollOptions([]);
          setPublicKeyFile(null);
          setPrivateKeyFile(null);
          setIsPrivateKeyDownloaded(false);
          setShowDownloadButton(false);
          setSelected(moods[5]);
          setSelectedEncryption(encryptionOptions[2]);
          setFiles([]);
          setSelectedGif(false);
          setKeyGenerated(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const formData = new FormData();
      formData.append('message', messageBody);
      formData.append('roomName', roomName);
      formData.append('roomGroupName', roomGroupName);
      formData.append('mood', selected.value);
      formData.append('encryption', 'none');

      // Append selected gif to formData
      if (selectedGif) {
        formData.append('gif', JSON.stringify(selectedGif));
      }

      if (poll) {
        formData.append('poll', JSON.stringify(poll));
      }

      if (audioURL) {
        const blob = await fetch(audioURL).then((r) => r.blob());
        formData.append('voice_message', blob, 'voice_message.mp3');
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      // Call the API that sends files with attachments
      try {
        // Call the API that sends files with attachments
        const response = await SendMessage(formData, files);
        if (response.status === 200) {
          setMessageBody('');
          setAudioURL(null);
          setPoll(null);
          setPollQuestion('');
          setPollOptions([]);
          setSelected(moods[5]);
          setSelectedEncryption(encryptionOptions[2]);
          setFiles([]);
          setSelectedGif(false);
        }
      } catch (error) {
        console.log(error);
      }
      //   console.log();
    }
  };

  const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
  useEffect(() => {
    setSendButtonDisabled(
      selectedEncryption.value === 'rsa_plus_base64' || selectedEncryption.value === 'lattice_based'
        ? (!isPrivateKeyDownloaded && messageBody !== '') || messageBody === ''
        : messageBody === '' || messageBody === '<p><br></p>',
    );

    if (selectedGif || audioURL || poll || files.length > 0) {
      setSendButtonDisabled(false);
    }
  }, [selectedEncryption, isPrivateKeyDownloaded, messageBody, selectedGif, audioURL, poll, files]);

  return (
    <div className="p-4">
      <SimpleEditor
        data={messageBody}
        setData={setMessageBody}
        placeholder="Write text here"
        // maxLength={
        //   encryptionOptions.value === 'rsa_plus_base64'
        //     ? MAX_RSA_MESSAGE_LENGTH
        //     : MAX_LATTICE_MESSAGE_LENGTH
        // }
      />
      <div className="-ml-4 mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <div className="flex items-center space-x-5">
            {/* eslint-disable-next-line */}
            <div {...getRootProps()}>
              {/* eslint-disable-next-line */}
              <input {...getInputProps()} />
              <button
                type="button"
                className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Attach a file</span>
              </button>
            </div>

            <div className="flex items-center">
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only"> Your mood </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                        <span className="flex items-center justify-center">
                          {selected.value === null ? (
                            <span>
                              <FaceSmileIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                              <span className="sr-only"> Add your mood </span>
                            </span>
                          ) : (
                            <span>
                              <span
                                className={classNames(
                                  selected.bgColor,
                                  'flex h-8 w-8 items-center justify-center rounded-full',
                                )}
                              >
                                <selected.icon
                                  className="h-5 w-5 flex-shrink-0 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="sr-only">{selected.name}</span>
                            </span>
                          )}
                        </span>
                      </Listbox.Button>

                      <div className="relative">
                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="absolute z-40 mt-1 -ml-6 w-60 -translate-y-full transform rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            <Listbox.Options>
                              {moods.map((mood) => (
                                <Listbox.Option
                                  key={mood.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'bg-gray-100' : 'bg-white',
                                      'relative cursor-default select-none py-2 px-3',
                                    )
                                  }
                                  value={mood}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={classNames(
                                        mood.bgColor,
                                        'flex h-8 w-8 items-center justify-center rounded-full',
                                      )}
                                    >
                                      <mood.icon
                                        className={classNames(
                                          mood.iconColor,
                                          'h-5 w-5 flex-shrink-0',
                                        )}
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <span className="ml-3 block truncate font-medium">
                                      {mood.name}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </>
                )}
              </Listbox>
            </div>

            <div className="flex-items flex">
              <GIFSelection
                selectedGif={selectedGif}
                setSelectedGif={setSelectedGif}
                gifs={gifs}
                setGifs={setGifs}
              />
            </div>

            {/* POLLS */}
            <CreatePollSec
              question={pollQuestion}
              setQuestion={setPollQuestion}
              options={pollOptions}
              setOptions={setPollOptions}
              poll={poll}
              setPoll={setPoll}
            />

            {/* VOICE NOTES */}
            <VoiceRecorder audioURL={audioURL} setAudioURL={setAudioURL} />

            {/* VOICE CALLS */}
            {/* <div className="flex-items flex">
              <button
                type="button"
                className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <span className="flex items-center justify-center">
                  <span>
                    <PhoneIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your mood </span>
                  </span>
                </span>
              </button>
            </div> */}

            {/* VIDEO CALLS */}
            {/* {isInVideoCall ? (
              <EndVideoCall />
            ) : (
              <StartVideoCall
                onStartVideoCall={onStartVideoCall}
                user={user}
                stream={stream}
                peerConnections={peerConnections}
                websocketVideoClientRef={websocketVideoClientRef}
                createPeerConnection={createPeerConnection}
              />
            )} */}

            {/* ENCRYPTION */}
            <div className="flex items-center">
              <Listbox value={selectedEncryption} onChange={setSelectedEncryption}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only"> Encryption </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                        <span className="flex items-center justify-center">
                          {selectedEncryption.value === null ? (
                            <span>
                              <LockClosedIcon
                                className="h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span className="sr-only"> Select encryption </span>
                            </span>
                          ) : (
                            <span>
                              <span
                                className={classNames(
                                  selectedEncryption.bgColor,
                                  'flex h-8 w-8 items-center justify-center rounded-full',
                                )}
                              >
                                <selectedEncryption.icon
                                  className="h-5 w-5 flex-shrink-0 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="sr-only">{selectedEncryption.name}</span>
                            </span>
                          )}
                        </span>
                      </Listbox.Button>

                      <div className="relative">
                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="absolute z-40 mt-1 -ml-6 w-60 -translate-y-full transform rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            <Listbox.Options>
                              {encryptionOptions.map((encryption) => (
                                <Listbox.Option
                                  key={encryption.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'bg-gray-100' : 'bg-white',
                                      'relative cursor-default select-none py-2 px-3',
                                    )
                                  }
                                  value={encryption}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={classNames(
                                        encryption.bgColor,
                                        'flex h-8 w-8 items-center justify-center rounded-full',
                                      )}
                                    >
                                      <encryption.icon
                                        className={classNames(
                                          encryption.iconColor,
                                          'h-5 w-5 flex-shrink-0',
                                        )}
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <span className="ml-3 block truncate font-medium">
                                      {encryption.name}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </>
                )}
              </Listbox>
            </div>

            {/* SETTINGS */}
            {/* <div className="flex-items flex">
              <button
                type="button"
                className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <span className="flex items-center justify-center">
                  <span>
                    <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your mood </span>
                  </span>
                </span>
              </button>
            </div> */}

            {/* More Options */}
            {/* <div className="flex-items flex">
              <button
                type="button"
                className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <span className="flex items-center justify-center">
                  <span>
                    <PlusIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your mood </span>
                  </span>
                </span>
              </button>
            </div> */}
          </div>
        </div>
        <div className="ml-4 mt-2 flex-shrink-0">
          {selectedEncryption.value === 'rsa_plus_base64' && !isPrivateKeyDownloaded && (
            <button
              type="button"
              onClick={handleDownloadPrivateKey}
              className="relative mr-2 inline-flex items-center bg-dark px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
            >
              {keyGenerated ? 'Download Private Key' : 'Encrypt'}
            </button>
          )}

          {selectedEncryption.value === 'lattice_based' && !isPrivateKeyDownloaded && (
            <button
              type="button"
              onClick={handleDownloadPrivateKey}
              className="relative mr-2 inline-flex items-center bg-dark px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
            >
              {keyGenerated ? 'Download Private Key' : 'Encrypt'}
            </button>
          )}

          <button
            type="button"
            disabled={sendButtonDisabled}
            onClick={handleSendMessage}
            className={`relative inline-flex items-center px-6 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              selectedEncryption.value === 'rsa_plus_base64' ||
              selectedEncryption.value === 'lattice_based'
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-iris-500 hover:bg-iris-600'
            } ${sendButtonDisabled ? 'cursor-not-allowed bg-gray-400 opacity-50' : ''}`}
          >
            Send
          </button>
        </div>
      </div>

      {audioURL && (
        <div className="mb-2 mt-1 flex">
          <audio src={audioURL} controls />
          <TrashIcon
            onClick={() => setAudioURL(null)}
            className="ml-2 mt-4 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
            aria-hidden="true"
          />
        </div>
      )}

      {poll && (
        <div className="my-4 flex w-full flex-col rounded-lg border bg-white p-4">
          <div className="-mt-4 border-b border-gray-200 bg-white ">
            <div className="  flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="">
                <p className="text-base font-semibold leading-6 text-gray-900">
                  <span className="font-bold">Created poll: </span>
                  {poll.question}
                </p>
              </div>
              <div className="my-2 ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPoll(null);
                    setPollQuestion('');
                    setPollOptions([]);
                    setPollOptions([]);
                    setPollQuestion('');
                  }}
                  className="relative inline-flex items-center rounded-md bg-iris-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-iris-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-600"
                >
                  Delete poll
                </button>
              </div>
            </div>
          </div>
          {poll.options.map((option, index) => (
            <div key={index} className="my-2 flex items-center">
              <div className="text-gray-700">{option}</div>
            </div>
          ))}
        </div>
      )}

      {selectedGif && (
        <div className="inline-flex p-4">
          <img
            src={selectedGif.url}
            width={20}
            height={20}
            alt={selectedGif.title}
            className="h-32 w-full rounded-lg object-contain"
          />
        </div>
      )}

      <div className="cursor-default text-sm text-gray-500">
        <span>{files.length} file(s) selected</span>
        {files.length < MAX_FILE_COUNT && (
          <span> (up to {MAX_FILE_COUNT - files.length} more)</span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap">
        {files.length > 0 && (
          <div className="flex flex-wrap items-center space-x-1">
            {files.map((file, index) => (
              <div key={file.name} className="flex items-center space-x-2">
                <span>{file.name}</span>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 focus:ring-red-500 flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => handleRemoveFile(index)}
                >
                  <TrashIcon
                    className="-ml-1 mr-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Remove file</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEncryption.value === 'rsa_plus_base64' && (
        <div className="p-2 text-gray-500">
          <p className="text-sm">
            This message will be encrypted with RSA and encoded in base64. The private key will be
            generated and downloaded by the sender. The recipient will need to provide the private
            key to decrypt the message.
          </p>
          <p className="mt-2 text-sm">
            Please ensure that the recipient understands the encryption method and you provide
            access to the private key through another channel after sending the message.
          </p>
        </div>
      )}
      {selectedEncryption.value === 'lattice_based' && (
        <div className="p-2 text-gray-500">
          <p className="text-sm">
            This message will be encrypted using a lattice-based encryption scheme, which provides a
            high level of security. The message will be encoded and sent to the recipient. The
            recipient will need to have the necessary keys to decrypt the message.
          </p>
          <p className="mt-2 text-sm">
            Please ensure that the recipient understands the encryption method and has the necessary
            keys to decrypt the message. It&apos;s important to keep the keys secure and not share
            them over the same channel as the encrypted message.
          </p>
        </div>
      )}
    </div>
  );
}
