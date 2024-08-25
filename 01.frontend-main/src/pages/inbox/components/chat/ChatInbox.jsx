import React, { useCallback, useEffect, useRef, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useDispatch, useSelector } from 'react-redux';
import GetUserInfo from '@/api/chat/GetUserInfo';
import LoadMessages from '@/api/chat/LoadMessages';
import Chatbox from './Chatbox';
import Message from '@/components/Message';
import { resetIsInVideoCall, resetVideoSrc } from '@/redux/actions/chat/chat';
import VideoComponent from './video/VideoComponent';

export default function ChatInbox({ chat, user }) {
  const [myParticipant, setMyParticipant] = useState();
  const [otherParticipants, setOtherParticipants] = useState([]);
  const [onlineParticipants, setOnlineParticipants] = useState([]);

  const userId = user && user.id;

  const roomName = chat && chat.room_name;
  const roomGroupName = chat && chat.room_group_name;

  // console.log('My Participant', myParticipant);
  // console.log('Other Participants', otherParticipants);
  // console.log('Online Participants', onlineParticipants);

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      const details = await Promise.all(
        chat &&
          chat.participants.map(async (participant) => {
            const res = await GetUserInfo(participant.uuid);
            return res.data.results;
          }),
      );

      setOtherParticipants([]); // Reset the otherParticipants array

      details.forEach((participant) => {
        if (participant.id === user && user.id) {
          setMyParticipant(participant);
        } else {
          setOtherParticipants((prevParticipants) => [...prevParticipants, participant]);
        }
      });
    };
    fetchParticipantDetails();
  }, [chat, user]);

  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(100);
  const [filterBy, setFilterBy] = useState(null);
  const [orderBy, setOrderBy] = useState('-timestamp');
  const [searchBy, setSearchBy] = useState('');

  const fetchMessages = useCallback(
    async (page, search) => {
      setLoading(true);
      const res = await LoadMessages(
        chat && chat.room_name,
        chat && chat.room_group_name,
        page,
        pageSize,
        maxPageSize,
        filterBy,
        orderBy,
        search,
      );
      if (res.data) {
        setCount(res.data.count);
        // Add a sender field to each message
        const updatedMessages = res.data.results.map((message) => {
          const sender = chat.participants.find(
            (participant) => participant.uuid === message.sender.uuid,
          );
          return { ...message, sender };
        });
        setMessages(updatedMessages);
      }
      setLoading(false);
    },
    [pageSize, maxPageSize, filterBy, orderBy, chat],
  );

  useEffect(() => {
    fetchMessages(currentPage, searchBy);
    // eslint-disable-next-line
  }, [fetchMessages, currentPage]);

  // const [inboxes, setInboxes] = useState([]);
  // Chatroom websocket
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const updateMessages = useCallback((message) => {
    setMessages((prevMessages) => {
      // Check if message is already present using messagesRef
      if (!messagesRef.current.some((m) => m.id === message.id)) {
        return [...prevMessages, message];
      }
      return prevMessages;
    });
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Chat Websocket
  const [stream, setStream] = useState(null);
  const [start, setStart] = useState(0);
  const [countMessages, setCountMessages] = useState(20);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const webSocketRef = useRef(null);
  useEffect(() => {
    let client = null;

    if (userId) {
      const safeSend = (message) => {
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      };

      const handleOpen = async () => {
        if (client.readyState === WebSocket.OPEN) {
          // await safeSend(
          //   JSON.stringify({
          //     type: 'user_disconnected',
          //     user_id: user && user.id,
          //   }),
          // );
          setConnected(true);
        }
      };

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);

        // console.log('Got this message from Channels Chat Room', message);
        switch (message.type) {
          case 'online_participants':
            setOnlineParticipants(message.participants);
            break;
          case 'chat_message':
            updateMessages(message.message);
            break;
          case 'poll_vote': {
            const pollVoteMessage = message.message;
            console.log('Someone voted for the poll', pollVoteMessage);
            const messageId = pollVoteMessage.id;
            const messageIndex = messages.findIndex((m) => m.id === messageId);
            if (messageIndex !== -1) {
              const updatedMessage = {
                ...messages[messageIndex],
                poll: pollVoteMessage.poll,
              };
              setMessages((prevMessages) => {
                const updatedMessages = prevMessages.map((m, index) => {
                  if (index === messageIndex) {
                    return updatedMessage;
                  } else {
                    return m;
                  }
                });
                return updatedMessages;
              });
            }
            break;
          }
          case 'active_streams':
            // console.log('Active Streams MESSAGE: ', message);
            setStream(message.chat.stream); // Update the stream state
            break;
          case 'video_call_started':
            // console.log('Video call started by user:', message);
            setStream(message.chat.stream); // Update the stream state
            break;
          case 'video_call_ended':
            // console.log('User left the video call:', message);
            setStream(message.chat.stream); // Update the stream state
            break;
          default:
            console.log('Unhandled message type:', message.type);
        }
      };

      const handleError = (e) => {
        console.error('WebSocket error:', e);
        setError(e);
        setConnected(false);
      };

      const handleClose = () => {
        setConnected(false);
        setTimeout(connectWebSocket, 5000); // Attempt to reconnect every 5 seconds
      };

      const connectWebSocket = () => {
        try {
          const protocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
          const path = `${protocol}://${
            process.env.NEXT_PUBLIC_APP_CHAT_API_WS
          }/ws/chat/${roomName}/?token=${encodeURIComponent(userId)}`;
          client = new W3CWebSocket(path);
          client.onopen = handleOpen;
          client.onmessage = handleMessage;
          client.onerror = handleError;
          client.onclose = handleClose;
          webSocketRef.current = client;
        } catch (e) {
          handleError(e);
        }
      };

      const disconnectWebSocket = async () => {
        if (client && client.readyState === WebSocket.OPEN) {
          await client.send(
            JSON.stringify({
              type: 'user_disconnected',
              user_id: user && user.id,
            }),
          );
          client.close();
          setConnected(false);
        }
      };

      if (user && chat && !client) {
        connectWebSocket();
      }

      return () => {
        disconnectWebSocket();
      };
    }
  }, [chat, roomName]);

  // When user clicks "Load More" button, fetch next set of notifications
  function loadMoreMessages() {
    setCountMessages(countMessages + 20); // increase countMessages by 20
    // Send message to server to fetch next set of messages with the updated countMessages value
    socket.send(
      JSON.stringify({
        type: 'get_messages',
        user_id: user && user.id,
        start,
        count: countMessages,
      }),
    );
  }

  const myVideoSrc = useSelector((state) => state.chat.videoSrc);
  const isInVideoCall = useSelector((state) => state.chat.isInVideoCall);
  // console.log(chat);
  const chatEl = useRef(null);
  useEffect(() => {
    // Scroll to the bottom of the chat element after it has rendered
    if (chatEl && chatEl.current) {
      chatEl.current.scrollTop = chatEl.current.scrollHeight;
    }
  }, [messages, isInVideoCall]);

  const dispatch = useDispatch();

  useEffect(() => {
    // Any other code to run when the component mounts
    dispatch(resetVideoSrc());
    dispatch(resetIsInVideoCall());
    return () => {
      dispatch(resetIsInVideoCall());
      dispatch(resetVideoSrc());
    };
  }, []);

  // Call consumer
  const [usersInCall, setUsersInCall] = useState([]);

  useEffect(() => {
    const newUsersInCall = onlineParticipants
      .filter((participant) => participant.is_in_call)
      .map((participant) => participant.uuid);

    setUsersInCall(newUsersInCall);
  }, [onlineParticipants]);

  const [remoteVideoStreams, setRemoteVideoStreams] = useState([]);
  const peerConnections = useRef({});
  const [pendingIceCandidates, setPendingIceCandidates] = useState({});
  const websocketVideoClientRef = useRef(null);
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      // You can add more STUN/TURN servers if needed
    ],
  };

  const remoteStreamIds = new Set();

  // Create a new RTCPeerConnection instance
  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection(iceServers);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        if (websocketVideoClientRef.current.readyState === WebSocket.OPEN) {
          websocketVideoClientRef.current.send(
            JSON.stringify({
              type: 'ice_candidate',
              candidate: event.candidate,
              to_user_id: userId,
            }),
          );
        } else {
          // console.log('WebSocket not ready to send ICE candidate.');
          // Optionally, you can implement a mechanism to retry sending the ICE candidate when the WebSocket is ready.
        }
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];

      // Check if the stream ID is not in the remoteStreamIds Set
      if (!remoteStreamIds.has(remoteStream.id)) {
        // Add the stream ID to the remoteStreamIds Set
        remoteStreamIds.add(remoteStream.id);

        setRemoteVideoStreams((prevRemoteVideoStreams) => [
          ...prevRemoteVideoStreams,
          remoteStream,
        ]);
      }
    };

    return peerConnection;
  };

  const [videoCallReady, setVideoCallReady] = useState(false);
  useEffect(() => {
    if (isInVideoCall && myVideoSrc) {
      setVideoCallReady(true);
    } else {
      setVideoCallReady(false);
    }
  }, [isInVideoCall, myVideoSrc]);

  const processedAnswers = useRef(new Set());
  const processedOffers = useRef(new Set());
  const processingOffers = useRef(new Set());

  useEffect(() => {
    const resetProcessedOffersAnswers = () => {
      processedOffers.current = new Set();
      processedAnswers.current = new Set();
    };

    const interval = setInterval(() => {
      resetProcessedOffersAnswers();
    }, 10000); // Reset every 10 seconds or any desired interval

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!videoCallReady) return;

    let videoClient = null;

    if (userId) {
      const handleOpen = async () => {
        console.log('Connected to Video Call Channel through Websocket');

        await webSocketRef.current.send(
          JSON.stringify({
            type: 'user_joined_video_room',
            user_id: user && user.id,
          }),
        );

        // Send an offer to all other users in the call
        usersInCall.forEach(async (otherUserId) => {
          if (otherUserId !== user && user.id) {
            // Create a peer connection if it doesn't exist
            if (!peerConnections.current[otherUserId]) {
              const peerConnection = createPeerConnection(otherUserId);
              peerConnections.current[otherUserId] = peerConnection;

              // Add local stream tracks to the peer connection
              myVideoSrc.getTracks().forEach((track) => {
                peerConnections.current[otherUserId].addTrack(track, myVideoSrc);
              });
            }
            if (peerConnections.current[otherUserId].signalingState === 'stable') {
              // Create an offer and set it as the local description
              const offer = await peerConnections.current[otherUserId].createOffer();
              await peerConnections.current[otherUserId].setLocalDescription(
                new RTCSessionDescription(offer),
              );

              // Send the offer to the other user
              websocketVideoClientRef.current.send(
                JSON.stringify({
                  type: 'offer',
                  offer: offer,
                  from_user_id: user && user.id,
                }),
              );
            }
          }
        });
      };

      const handleOffer = async (message) => {
        // console.log('Step 1: Received offer:', message);
        const fromUserId = message.from_user_id;
        const { offer } = message;

        // Return if the offer has already been processed
        if (processedOffers.current.has(fromUserId)) {
          console.log(`Offer from user ID ${fromUserId} already processed`);
          return;
        }

        // Check if there is a peer connection for the user who sent the offer
        if (!peerConnections.current[fromUserId]) {
          // Create a new RTCPeerConnection instance for the user who sent the offer
          const peerConnection = createPeerConnection(fromUserId);
          peerConnections.current[fromUserId] = peerConnection;

          // Add local stream tracks to the peer connection
          myVideoSrc.getTracks().forEach((track) => {
            peerConnections.current[fromUserId].addTrack(track, myVideoSrc);
          });
        }

        // Set the received offer as the remote description
        await peerConnections.current[fromUserId].setRemoteDescription(
          new RTCSessionDescription(offer),
        );

        // Return if the offer is already being processed
        if (processingOffers.current.has(fromUserId)) {
          console.log(`Offer from user ID ${fromUserId} is being processed`);
          return;
        }

        // Mark the offer as being processed
        processingOffers.current.add(fromUserId);

        // Check if the peer connection's signaling state is "have-remote-offer"
        if (peerConnections.current[fromUserId].signalingState === 'have-remote-offer') {
          // Create an answer and set it as the local description
          const answer = await peerConnections.current[fromUserId].createAnswer();
          await peerConnections.current[fromUserId].setLocalDescription(
            new RTCSessionDescription(answer),
          );

          // Send the answer to the user who sent the offer
          websocketVideoClientRef.current.send(
            JSON.stringify({
              type: 'answer',
              answer: answer,
              from_user_id: user.id,
              to_user_id: fromUserId,
            }),
          );

          // Mark the offer as processed
          processedOffers.current.add(fromUserId);
        } else {
          console.log(
            `Unexpected signaling state for user ID ${fromUserId}: ${peerConnections.current[fromUserId].signalingState}`,
          );
          setTimeout(() => handleOffer(message), 1000); // Retry after a short delay
        }

        // At the end of the function, remove the offer from processing offers
        processingOffers.current.delete(fromUserId);
      };

      const processAnswer = async (message, retryCount = 0) => {
        const fromUserId = message.from_user_id;
        const { answer } = message;

        const peerConnection = peerConnections.current[fromUserId];
        if (!peerConnection) {
          console.log(`No peer connection found for user ID ${fromUserId}`);
          return;
        }

        if (peerConnection.signalingState !== 'have-local-offer') {
          if (retryCount < 5) {
            setTimeout(() => processAnswer(message, retryCount + 1), 1000);
          } else {
            console.log(
              `Failed to process answer from user ID ${fromUserId} due to signaling state:`,
              peerConnection.signalingState,
            );
          }
          return;
        }

        console.log(
          `Peer connection signaling state for user ID ${fromUserId}:`,
          peerConnection.signalingState,
        );

        console.log(`Setting remote description for user ID ${fromUserId}`);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

        // Mark the answer as processed
        processedAnswers.current.add(fromUserId);
      };

      const debounce = (func, wait) => {
        let timeout;

        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };

          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };
      const debouncedProcessAnswer = debounce(processAnswer, 1000);

      const handleAnswer = async (message) => {
        // console.log('Step 2: Received answer:', message);

        const fromUserId = message.from_user_id;
        const { answer } = message;

        const peerConnection = peerConnections.current[fromUserId];
        if (!peerConnection) {
          console.log(`No peer connection found for user ID ${fromUserId}`);
          return;
        }

        // Return if the answer has already been processed
        if (processedAnswers.current.has(fromUserId)) {
          console.log(`Answer from user ID ${fromUserId} already processed`);
          return;
        }

        // Process the answer
        debouncedProcessAnswer(message);
      };

      const handleIceCandidate = (message) => {
        // console.log('Step 3: Received ICE candidate:', message);
        const fromUserId = message.from_user_id;
        const { candidate } = message;

        // Get the peer connection for the user who sent the ICE candidate
        const peerConnection = peerConnections.current[fromUserId];

        if (!peerConnection) {
          console.log(`No peer connection found for user ID: ${fromUserId}`);
          return;
        }

        // If the remote description is not set yet, store the candidate in the pending queue
        if (!peerConnection.remoteDescription || !peerConnection.remoteDescription.type) {
          if (!pendingIceCandidates[fromUserId]) {
            pendingIceCandidates[fromUserId] = [];
          }
          pendingIceCandidates[fromUserId].push(candidate);
          setPendingIceCandidates({ ...pendingIceCandidates });
        } else {
          // Add the received ICE candidate to the peer connection
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      };

      const handleUserLeft = (message) => {
        const { user_id: leftUserId } = message;
        if (leftUserId !== user.id) {
          // Remove the disconnected user's remote stream
          const peerConnection = peerConnections.current[leftUserId];
          if (peerConnection) {
            const remoteStream = peerConnection.getRemoteStreams()[0];
            if (remoteStream) {
              setRemoteVideoStreams((prevRemoteVideoStreams) =>
                prevRemoteVideoStreams.filter((s) => s.id !== remoteStream.id),
              );
            }
          }

          // Close the peer connection and remove it from the peerConnections ref
          if (peerConnections.current[leftUserId]) {
            peerConnections.current[leftUserId].close();
            delete peerConnections.current[leftUserId];
          }

          // Reset the processedOffers and processedAnswers for the user who left the video call
          processedOffers.current.delete(leftUserId);
          processedAnswers.current.delete(leftUserId);
        }
      };

      const handleUserJoined = async (message) => {
        const { user_id: joinedUserId } = message;

        // Reset the processedOffers and processedAnswers for the user who joined the video call
        processedOffers.current.delete(joinedUserId);
        processedAnswers.current.delete(joinedUserId);

        if (joinedUserId !== user.id) {
          // Create a peer connection if it doesn't exist
          if (!peerConnections.current[joinedUserId]) {
            const peerConnection = createPeerConnection(joinedUserId);
            peerConnections.current[joinedUserId] = peerConnection;

            // Add local stream tracks to the peer connection
            myVideoSrc.getTracks().forEach((track) => {
              peerConnections.current[joinedUserId].addTrack(track, myVideoSrc);
            });
          }

          if (peerConnections.current[joinedUserId].signalingState === 'stable') {
            // Create an offer and set it as the local description
            const offer = await peerConnections.current[joinedUserId].createOffer();
            await peerConnections.current[joinedUserId].setLocalDescription(
              new RTCSessionDescription(offer),
            );

            // Send the offer to the other user
            websocketVideoClientRef.current.send(
              JSON.stringify({
                type: 'offer',
                offer: offer,
                from_user_id: user.id,
              }),
            );
          }
        }
      };

      const handleUpdatedUsersList = (message) => {
        const { users } = message;

        setUsersInCall(users.filter((userId) => userId !== user.id));
      };

      const handleMessage = async (event) => {
        // console.log('Received WebSocket message:', event.data);
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'offer':
            // Call handleOffer only for the user who is not the sender of the offer
            if (message.from_user_id !== user.id) {
              handleOffer(message);
            }
            break;
          case 'answer':
            if (message.to_user_id === user.id) {
              handleAnswer(message);
            }
            break;
          case 'ice_candidate':
            handleIceCandidate(message);
            break;
          case 'user_left_video_room':
            handleUserLeft(message);
            break;
          case 'user_joined_video_room':
            handleUserJoined(message);
            break;
          case 'update_users_list':
            handleUpdatedUsersList(message);
            break;
          default:
            console.log('Unhandled message type:', message.type);
        }
      };

      const handleError = (e) => {
        console.error('WebSocket error:', e);
        setError(e);
        setConnected(false);
      };

      const connectWebSocket = () => {
        try {
          const protocol = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'wss' : 'ws';
          const path = `${protocol}://${
            process.env.NEXT_PUBLIC_APP_CHAT_API_WS
          }/ws/call/${roomName}/?token=${encodeURIComponent(userId)}`;
          videoClient = new W3CWebSocket(path);
          videoClient.onopen = handleOpen;
          videoClient.onmessage = handleMessage;
          videoClient.onerror = handleError;
          websocketVideoClientRef.current = videoClient;
        } catch (e) {
          handleError(e);
        }
      };

      const disconnectWebSocket = () => {
        console.log('Disconnected from Video Call Channel');
        if (webSocketRef.current) {
          webSocketRef.current.send(
            JSON.stringify({
              type: 'user_left_video_room',
              user_id: user && user.id,
            }),
          );
        }
        if (videoClient) {
          videoClient.close();
        }
      };

      if (user && chat && isInVideoCall && !videoClient) {
        connectWebSocket();
      }

      // Return a cleanup function to remove event listeners and close the WebSocket connection
      return () => {
        if (videoClient) {
          disconnectWebSocket();
        }
      };
    }
  }, [videoCallReady]);

  const sendVideoCallStarted = () => {
    if (webSocketRef) {
      webSocketRef.current.send(
        JSON.stringify({
          type: 'video_call_started',
          user_id: user && user.id,
        }),
      );
    }
  };

  // console.log('remoteVideoStreams', remoteVideoStreams);

  // const leaveVideoCall = () => {
  //   if (webSocketRef) {
  //       webSocketRef.current.send(
  //           JSON.stringify({
  //               type: 'leave_video_call',
  //               user_id: user && user.id,
  //           }),
  //       );
  //   }
  // };

  // console.log(remoteVideoStreams);

  return (
    <>
      {isInVideoCall ? (
        <div className="flex h-full flex-col">
          {/* Main content */}
          <div className="flex h-full md:h-72 xl:h-96 2xl:h-[550px]">
            <main className="flex flex-1 flex-col overflow-hidden">
              {/* Primary column */}
              <section
                aria-labelledby="primary-heading"
                className="flex min-w-0 flex-1 flex-col lg:order-last"
              >
                <h1 id="primary-heading" className="sr-only">
                  Videos Grid
                </h1>
                <div className="video-grid">
                  {' '}
                  {/* Add this div */}
                  {/* Your content */}
                  {myVideoSrc && isInVideoCall && (
                    <div className="local-video">
                      <VideoComponent myVideoSrc={myVideoSrc} className="h-full w-full" />
                    </div>
                  )}
                  {/* Render RemoteVideoComponent for each online participant */}
                  {remoteVideoStreams.map((s, index) => (
                    <div key={s} className="remote-video">
                      <video
                        ref={(video) => {
                          if (video) {
                            video.srcObject = s;
                          }
                        }}
                        muted
                        autoPlay
                        playsInline
                      />
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside
              ref={chatEl}
              className="relative hidden w-96 space-y-4 overflow-y-auto border-l border-gray-200 bg-white lg:block"
            >
              {/* Participants */}
              <div className="sticky top-0 z-30 border-b border-gray-200  bg-white px-4 sm:px-6">
                <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                  <div className="ml-4 ">
                    <div className="flex space-x-2 overflow-hidden p-4">
                      {myParticipant && (
                        <a href={`/@${myParticipant.username}`} className="relative inline-block">
                          <img
                            className="h-6 w-6 rounded-full ring-2"
                            src={myParticipant.profile}
                            alt=""
                            style={{
                              borderColor: myParticipant.is_online
                                ? myParticipant.is_in_call
                                  ? 'blue' // blue ring when in call
                                  : 'green' // green ring when online
                                : 'gray', // gray ring when offline
                            }}
                          />
                          <span
                            className={`${
                              myParticipant.is_online === true
                                ? 'bg-forest-green-300 ring-forest-green-100'
                                : 'bg-gray-300 ring-white'
                            } absolute -top-1 -left-1 block h-2 w-2 translate-x-1/2 translate-y-1/2 transform rounded-full`}
                          />
                        </a>
                      )}
                      {otherParticipants &&
                        otherParticipants.map((participant) => {
                          const isOnline = onlineParticipants.some(
                            (onlineParticipant) =>
                              onlineParticipant.uuid === participant.id &&
                              onlineParticipant.is_online,
                          );
                          const isInCall = onlineParticipants.some(
                            (onlineParticipant) =>
                              onlineParticipant.uuid === participant.id &&
                              onlineParticipant.is_in_call,
                          );
                          return (
                            <a
                              href={`/@${participant.username}`}
                              className="relative inline-block"
                              key={participant.id}
                            >
                              <img
                                className={`h-6 w-6 rounded-full ${
                                  isInCall
                                    ? 'ring-2 ring-blue-300'
                                    : isOnline
                                    ? 'ring-2 ring-forest-green-300'
                                    : 'ring-2 ring-gray-300'
                                }`}
                                src={participant.profile}
                                alt=""
                              />
                              <span
                                className={`${
                                  participant.is_online === true
                                    ? 'bg-forest-green-300 ring-forest-green-100'
                                    : 'bg-gray-300 ring-white'
                                } absolute -top-1 -left-1 block h-2 w-2 translate-x-1/2 translate-y-1/2 transform rounded-full`}
                              />
                            </a>
                          );
                        })}
                    </div>
                  </div>
                  <div className="ml-4  flex-shrink-0">
                    <button
                      type="button"
                      className="rounded bg-white py-1 px-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Add users
                    </button>
                  </div>
                </div>
              </div>

              {/* Your content */}
              {(loading && connected) || (otherParticipants && otherParticipants.length > 0) ? (
                <>
                  {messages.length >= 19 && (
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center border border-gray-500 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                    >
                      Show more
                    </button>
                  )}
                  {messages.length > 0 && (
                    <>
                      {messages
                        .filter(
                          (message, index, self) =>
                            index === self.findIndex((m) => m.id === message.id),
                        )
                        .map((message) => (
                          <Message
                            key={message.id}
                            message={message}
                            chat={chat}
                            user={user && user}
                            myParticipant={myParticipant}
                            otherParticipants={otherParticipants}
                          />
                        ))}
                    </>
                  )}
                  <div />
                </>
              ) : (
                <>loading...</>
              )}
            </aside>
          </div>
          <Chatbox
            isInVideoCall={isInVideoCall}
            roomName={roomName}
            roomGroupName={roomGroupName}
            onStartVideoCall={sendVideoCallStarted}
            user={user}
            stream={stream}
            peerConnections={peerConnections}
            websocketVideoClientRef={websocketVideoClientRef}
            createPeerConnection={createPeerConnection}
          />
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {/* Participants */}
          <div className="border-b border-gray-200 bg-white px-4 sm:px-6">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <div className="flex space-x-2 overflow-hidden p-4">
                  {myParticipant && (
                    <a href={`/@${myParticipant.username}`} className="relative inline-block">
                      <img
                        className="h-6 w-6 rounded-full ring-2 ring-forest-green-300 "
                        src={myParticipant.profile}
                        alt=""
                      />
                      <span
                        className={`${
                          myParticipant.is_online === true
                            ? 'bg-forest-green-300 ring-forest-green-100'
                            : 'bg-gray-300 ring-white'
                        } absolute -top-1 -left-1 block h-2 w-2 translate-x-1/2 translate-y-1/2 transform rounded-full`}
                      />
                    </a>
                  )}
                  {otherParticipants.map((participant) => {
                    const isOnline = onlineParticipants.some(
                      (onlineParticipant) =>
                        onlineParticipant.uuid === participant.id && onlineParticipant.is_online,
                    );
                    const isInCall = onlineParticipants.some(
                      (onlineParticipant) =>
                        onlineParticipant.uuid === participant.id && onlineParticipant.is_in_call,
                    );
                    return (
                      <a
                        href={`/@${participant.username}`}
                        className="relative inline-block"
                        key={participant.id}
                      >
                        <img
                          className={`h-6 w-6 rounded-full ${
                            isInCall
                              ? 'ring-2 ring-blue-300'
                              : isOnline
                              ? 'ring-2 ring-forest-green-300'
                              : 'ring-2 ring-gray-300'
                          }`}
                          src={participant.profile}
                          alt=""
                        />
                        <span
                          className={`${
                            participant.is_online === true
                              ? 'bg-forest-green-300 ring-forest-green-100'
                              : 'bg-gray-300 ring-white'
                          } absolute -top-1 -left-1 block h-2 w-2 translate-x-1/2 translate-y-1/2 transform rounded-full`}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="ml-4 mt-4 flex-shrink-0">
                <button
                  type="button"
                  className="rounded bg-white py-1 px-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Add users
                </button>
              </div>
            </div>
          </div>
          {/* Chat UI  */}
          <div
            ref={chatEl}
            className="h-72 w-full flex-auto space-y-4 overflow-y-auto p-5 md:h-72 xl:h-96 2xl:h-[550px]"
          >
            {(loading && connected) || otherParticipants.length > 0 ? (
              <>
                {messages.length >= 19 && (
                  <button
                    type="button"
                    className="inline-flex w-full  items-center justify-center border border-gray-500 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                  >
                    Show more
                  </button>
                )}
                {messages.length > 0 && (
                  <>
                    {messages
                      .filter(
                        (message, index, self) =>
                          index === self.findIndex((m) => m.id === message.id),
                      )
                      .map((message) => (
                        <Message
                          key={message.id}
                          message={message}
                          chat={chat}
                          user={user && user}
                          myParticipant={myParticipant}
                          otherParticipants={otherParticipants}
                        />
                      ))}
                  </>
                )}
                <div />
              </>
            ) : (
              <>loading...</>
            )}
          </div>

          {/* Message Input */}
          <Chatbox
            isInVideoCall={isInVideoCall}
            roomName={roomName}
            roomGroupName={roomGroupName}
            onStartVideoCall={sendVideoCallStarted}
            user={user}
            stream={stream}
            peerConnections={peerConnections}
            websocketVideoClientRef={websocketVideoClientRef}
            createPeerConnection={createPeerConnection}
          />
        </div>
      )}
      <div />
    </>
  );
}
