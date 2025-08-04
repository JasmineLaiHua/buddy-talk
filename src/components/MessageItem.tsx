import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import clsx from 'clsx';

interface MessageItemProps {
  userId: string;
  text: string;
  datetime: string;
  currentUserId: string;
  status: string;
}

const MessageItem = ({
  userId,
  text,
  datetime,
  currentUserId,
  status,
}: MessageItemProps) => {
  const getImageUrl = (userId: string) => {
    return new URL(`../assets/${userId}.png`, import.meta.url).href;
  };

  const isCurrentUser = useMemo(
    () => currentUserId === userId,
    [currentUserId, userId]
  );

  const formattedTime = useMemo(
    () => format(parseISO(datetime), 'hh:mm a'),
    [datetime]
  );

  return (
    <div
      className={
        isCurrentUser
          ? 'flex flex-row-reverse items-center space-x-reverse space-x-3'
          : 'flex items-center space-x-3'
      }
    >
      <div className="flex-shrink-0">
        <img
          src={getImageUrl(userId)}
          alt={userId}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
        />
        <span className="mt-2 text-xs text-gray-500 font-small">{userId}</span>
      </div>
      <div className={!isCurrentUser ? 'flex-1 mb-5' : 'flex-1'}>
        <div
          className={
            isCurrentUser
              ? 'flex items-center flex-row-reverse gap-2'
              : 'flex items-center gap-2'
          }
        >
          <div className="relative bg-slate-200 text-gray-800 p-2 rounded-md">
            <span className="text-sm leading-relaxed break-words">{text}</span>
            <div
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-200 transform rotate-45',
                isCurrentUser ? 'right-[-3px]' : 'left-[-3px]'
              )}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {formattedTime}
          </span>
        </div>
        {isCurrentUser && (
          <div className="flex items-center justify-end gap-1 ml-2 text-xs text-gray-500">
            {status === 'Sent' ? (
              <>
                <IoCheckmark className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span>Sent</span>
              </>
            ) : (
              <>
                <IoClose className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>Error</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
