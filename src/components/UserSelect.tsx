import { useState, useRef, useEffect } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { IUser } from '@/interfaces/user';

interface DropdownProps {
  options: IUser[];
  onSelectUser: (user: IUser) => void;
}

const UserSelect = ({ options, onSelectUser }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<IUser>(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(ev.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: IUser) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectUser(option);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2 text-left">Choose User</h2>
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-white border border-gray-300 rounded-md shadow-sm p-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption.name}</span>
          {isOpen ? <IoChevronUp /> : <IoChevronDown />}
        </div>

        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto text-left">
            {options.map((option) => (
              <li
                key={option.userId}
                className="p-2 hover:bg-slate-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default UserSelect;
