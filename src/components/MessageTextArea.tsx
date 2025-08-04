import { useState, KeyboardEvent, FormEvent } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

interface MessageTextAreaProps {
  isSending: boolean;
  onSendMessage: (message: string) => void;
}

const MessageTextArea = ({
  isSending,
  onSendMessage,
}: MessageTextAreaProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!message.trim()) return;

      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message and Enter"
          className="w-full p-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={2}
        />
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className="absolute right-2 bottom-2 p-2 text-blue-500 disabled:text-gray-400 focus:outline-none"
          title={isSending ? 'Sending...' : 'Send'}
        >
          {isSending ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageTextArea;
