import React, { useEffect, useRef, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { cn } from '@/utils/cn';
import { twMerge } from 'tailwind-merge';
import { type CustomSelectProps } from './Select.type';

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  optionstyle,
  listStyle,
  selected,
  onSelect = () => {},
  className,
  defaultLabel,
  type = 'button',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const selectRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 256;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownDirection('up');
      } else {
        setDropdownDirection('down');
      }
    }
  }, [isOpen]);

  // Toggle dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option?.value === selected);

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type={type}
        className={twMerge(
          cn(
            'w-full py-2 px-4 flex justify-between items-center bg-white text-gray-800 border rounded-md text-wrap-select',
            { 'border-light-rose': isOpen }
          ),
          className
        )}
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          {selectedOption?.icon && (
            <img src={selectedOption.icon} alt={selectedOption.label} className="w-5 h-5 mr-2" />
          )}
          {selectedOption?.label ? selectedOption?.label : defaultLabel || 'Select...'}
        </div>
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </button>

      {isOpen && (
        <div
          className={twMerge(
            cn(
              'absolute z-[999] bg-white rounded-bl-md rounded-br-md max-h-64 overflow-auto w-full',
              optionstyle,
              dropdownDirection === 'up' ? 'bottom-full' : 'top-full',
              dropdownDirection === 'up' ? 'bottom-9' : 'top-full'
            )
          )}
        >
          {options.map((option, index) => (
            <button
              key={index}
              className={cn(
                'flex items-center p-3 hover:bg-tonal-gray cursor-pointer w-full text-wrap-select',
                listStyle
              )}
              onClick={() => handleSelect(option.value)}
            >
              {option?.icon && (
                <img src={option?.icon} alt={option?.label} className="w-5 h-5 mr-2" />
              )}
              {option?.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
