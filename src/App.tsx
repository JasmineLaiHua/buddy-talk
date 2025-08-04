import './App.css';
import { useState, useEffect, useMemo } from 'react';
import UserSelect from '@/components/UserSelect';
import ChannelMenu from '@/components/ChannelMenu';
import { IMessage, IMessageResponse } from '@/interfaces/message';
import { IUser } from '@/interfaces/user';
import { IChannel } from '@/interfaces/channel';
import Chat from '@/features/Chat';
import { useQuery, useLazyQuery, useApolloClient } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import {
  FETCH_LATEST_MESSAGES,
  FETCH_MORE_MESSAGES,
  GET_ERROR_MESSAGES,
} from '@/graphql/queries';
import { toast } from 'react-toastify';

function App() {
  const [selectedUser, setSelectedUser] = useState<IUser>({
    userId: 'Russell',
    name: 'Russell',
  });
  const [selectedChannel, setSelectedChannel] = useState<IChannel>({
    id: '1',
    name: 'General Channel',
  });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [fetchingPrevious, setFetchingPrevious] = useState<boolean>(false);
  const [fetchingNext, setFetchingNext] = useState<boolean>(false);
  const apollo = useApolloClient();

  const { data: latest } = useQuery(FETCH_LATEST_MESSAGES, {
    variables: { channelId: selectedChannel.id },
    fetchPolicy: 'network-only',
  });
  const { data: errorMessagesData } = useQuery(GET_ERROR_MESSAGES);

  const allErrorMessages = errorMessagesData?.errorMessages || [];
  const userUnsentMessages = allErrorMessages.filter(
    (msg: IMessage) =>
      msg.channelId === selectedChannel.id && msg.userId === selectedUser.userId
  );

  const setFetching: { [key: string]: (value: boolean) => void } = {
    true: () => setFetchingPrevious,
    false: () => setFetchingNext,
  };

  const [fetchMoreMessagesQuery] = useLazyQuery(FETCH_MORE_MESSAGES);

  useEffect(() => {
    setLoadingMessage(true);
    if (latest) {
      const serverMessages = Array.isArray(latest.fetchLatestMessages)
        ? latest.fetchLatestMessages
        : [];
      const mappedData = transformMessages(serverMessages);

      setMessages(mappedData.reverse());
      setLoadingMessage(false);
    }
  }, [latest, selectedChannel.id]);

  const transformMessages = (messages: IMessageResponse[]): IMessage[] =>
    messages.map((message) => ({
      ...message,
      status: 'Sent',
      channelId: selectedChannel.id,
    }));

  const allMessages = useMemo(() => {
    return [...messages, ...userUnsentMessages].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
  }, [messages, userUnsentMessages]);

  const handleFetchMore = (messageId: string, old: boolean) => {
    const oldBooleanToString = String(old);
    setFetching[oldBooleanToString](true);

    fetchMoreMessagesQuery({
      variables: {
        channelId: selectedChannel.id,
        messageId,
        old,
      },
      fetchPolicy: 'network-only',
      onCompleted: ({ fetchMoreMessages }) => {
        if (Array.isArray(fetchMoreMessages)) {
          const mapped = fetchMoreMessages.map((msg: any) => ({
            ...msg,
            status: msg.status || 'Sent',
          }));
          if (old) {
            setMessages((prev) => [...mapped.slice().reverse(), ...prev]);
          } else {
            setMessages((prev) => [...prev, ...mapped]);
          }
        }
        setFetching[oldBooleanToString](false);
      },
      onError: (error) => {
        setFetching[oldBooleanToString](false);
        toast.error(error.message, {
          autoClose: 3000,
        });
      },
    });
  };

  const handleSendSuccess = (message: IMessage) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        status: 'Sent',
      },
    ]);
  };

  const handleSendFailure = (userId: string, message: string) => {
    const newError = {
      userId,
      text: message,
      datetime: new Date().toISOString(),
      messageId: `id-${Date.now()}`,
      status: 'Error',
      channelId: selectedChannel.id,
      __typename: 'Message',
    };

    const existingData = apollo.readQuery({
      query: GET_ERROR_MESSAGES,
    });

    apollo.writeQuery({
      query: GET_ERROR_MESSAGES,
      data: {
        errorMessages: [...(existingData?.errorMessages || []), newError],
      },
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="container mx-auto text-left">
        <h1 className="text-2xl font-bold">Buddy Talk</h1>
        <p className="text-sm opacity-90">
          All messages will be deleted at every 00:00 UTC
        </p>
      </div>

      <div className="h-[70vh] md:h-[75vh] lg:h-[80vh] grid grid-cols-4 gap-4 border-2 rounded-md">
        <div className="p-4">
          <div className="mb-6">
            <UserSelect
              options={[
                { userId: 'Russell', name: 'Russell' },
                { userId: 'Joyse', name: 'Joyse' },
                { userId: 'Sam', name: 'Sam' },
              ]}
              onSelectUser={(user: IUser) => setSelectedUser(user)}
            />
          </div>
          <div>
            <ChannelMenu
              channels={[
                { id: '1', name: 'General Channel' },
                { id: '2', name: 'Technology Channel' },
                { id: '3', name: 'LGTM Channel' },
              ]}
              onSelectChannel={(channel: IChannel) =>
                setSelectedChannel(channel)
              }
            />
          </div>
        </div>

        <div className="flex flex-col col-span-3 h-full overflow-y-auto border-l">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold text-left">
              {selectedChannel.name}
            </h2>
          </div>
          <Chat
            messages={allMessages}
            userId={selectedUser.userId}
            channelId={selectedChannel.id}
            fetchingPrevious={fetchingPrevious}
            fetchingNext={fetchingNext}
            onFetchMore={handleFetchMore}
            onSendMessageSuccess={handleSendSuccess}
            onSendMessageError={handleSendFailure}
            loading={loadingMessage}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
