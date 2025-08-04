import { IChannel } from '@/interfaces/channel';
import { useState } from 'react';
import clsx from 'clsx';

interface ChannelMenuProps {
  channels: IChannel[];
  onSelectChannel: (channel: IChannel) => void;
}

const ChannelMenu = ({ channels, onSelectChannel }: ChannelMenuProps) => {
  const [selectedChannel, setSelectedChannel] = useState<IChannel>(channels[0]);

  const handleSelect = (item: IChannel) => {
    setSelectedChannel(item);
    onSelectChannel(item);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 font-sans">
      <h2 className="text-lg font-semibold mb-2 text-left">Choose Channel</h2>
      <div className="rounded-md overflow-hidden bg-white border border-gray-200">
        {channels.map((channel: IChannel) => (
          <div
            key={channel.id}
            onClick={() => handleSelect(channel)}
            className={clsx(
              'px-2 py-2 cursor-pointer transition-colors duration-150 text-left',
              selectedChannel.id === channel.id
                ? 'bg-slate-200'
                : 'bg-white hover:bg-slate-100'
            )}
          >
            {channel.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelMenu;
