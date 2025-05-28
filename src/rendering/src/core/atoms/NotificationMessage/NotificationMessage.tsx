import React from 'react';
import { ITypesNotificationMessage } from './NotificationMessage.type';
import { FORM_SUBMITTED_ERROR_MESSAGES } from '@/utils/constants';
import { IoMdWarning } from 'react-icons/io';
import { HiMiniXMark } from 'react-icons/hi2';
import { cn } from '@/utils/cn';
const NotificationMessage = ({
  message = FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT,
  className,
  isCloseable = false,
  onCancel,
}: ITypesNotificationMessage) => {
  return (
    <div
      className={cn(
        `fixed left-1/2 transform -translate-x-1/2 z-100 top-12 md:top-17 lg:top-32 flex items-center gap-x-1 bg-pink-100 border-b border-red-500 md:border md:border-red-500 md:mx-1 p-3 md:mr-4 md:mb-2 md:mt-5 lg:mt-3 md:rounded-md w-full lg:w-auto max-w-740 ${className}`
      )}
    >
      <div className="w-5 h-5 mr-3">
        <IoMdWarning color="red" size={20} />
      </div>

      <div>{message}</div>
      {isCloseable && (
        <div className="ml-3 mr-2 cursor-pointer" onClick={onCancel}>
          <HiMiniXMark size={20} />
        </div>
      )}
    </div>
  );
};

export default NotificationMessage;
