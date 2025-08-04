import { useMemo, useState } from 'react';
import MessageItem from '@/components/MessageItem';
import MessageTextArea from '@/components/MessageTextArea';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { IMessage } from '@/interfaces/message';
import { useMutation } from '@apollo/client';
import { POST_MESSAGE } from '@/graphql/mutations';
import { toast } from 'react-toastify';

interface ChatProps {
  messages: IMessage[];
  userId: string;
  channelId: string;
  fetchingPrevious: boolean;
  fetchingNext: boolean;
  loading: boolean;
  onFetchMore: (messageId: string, old: boolean) => void;
  onSendMessageSuccess: (message: IMessage) => void;
  onSendMessageError: (userId: string, message: string) => void;
}

const Chat = ({
  messages,
  userId,
  channelId,
  fetchingPrevious,
  fetchingNext,
  loading,
  onFetchMore,
  onSendMessageSuccess,
  onSendMessageError,
}: ChatProps) => {
  const [isSending, setIsSending] = useState(false);
  const [postMessage] = useMutation(POST_MESSAGE);
  const lastSentMessage = useMemo(() => {
    const validMessages = messages.filter((msg) => msg.status !== 'Error');
    return validMessages[validMessages.length - 1];
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);

    postMessage({
      variables: {
        channelId,
        text: message,
        userId,
      },
      onCompleted(data) {
        setIsSending(false);
        onSendMessageSuccess(data.postMessage);
      },
      onError(error) {
        setIsSending(false);
        onSendMessageError(userId, message);
        toast.error(error.message, {
          autoClose: 3000,
        });
      },
    });
  };

  const handleFetchPrevious = () => {
    onFetchMore && onFetchMore(messages[0].messageId, true);
  };

  const handleFetchNext = () => {
    onFetchMore && onFetchMore(lastSentMessage.messageId, false);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 italic">No messages yet.</div>
        ) : (
          <div>
            <button
              className="flex items-center mb-2 text-blue-500 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFetchPrevious}
              disabled={fetchingPrevious || !messages.length || isSending}
            >
              {fetchingPrevious ? 'Loading...' : 'Read More'}
              <FiArrowUp className="h-4 w-4" />
            </button>

            {messages.map((message: IMessage) => (
              <div key={message.messageId}>
                <MessageItem
                  userId={message.userId}
                  text={message.text}
                  datetime={message.datetime}
                  currentUserId={userId}
                  status={message.status}
                />
              </div>
            ))}

            <button
              className="flex items-center mt-2 text-blue-500 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFetchNext}
              disabled={fetchingNext || !messages.length || isSending}
            >
              {fetchingNext ? 'Loading...' : 'Read More'}
              <FiArrowDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <MessageTextArea
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>
    </>
  );
};

export default Chat;
