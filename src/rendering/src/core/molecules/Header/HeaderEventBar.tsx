import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { HeaderFieldProps } from './Header.types';
import { FaTimes } from 'react-icons/fa';
import { RichText } from '@sitecore-jss/sitecore-jss-nextjs';

const HeaderEventBar = (props: HeaderFieldProps): JSX.Element | null => {
  const { HeaderDescription, MobileDescription, DateTime } = props;
  const [showEventBar, setShowEventbar] = useState(false);
  const eventTime = new Date(DateTime?.value).getTime();
  const currentTime = new Date().getTime();

  useEffect(() => {
    const eventBarDismissed = Cookies.get('eventBarDismissed');
    if (!eventBarDismissed && currentTime <= eventTime) {
      setShowEventbar(true);
    } else {
      setShowEventbar(false);
    }
  }, [currentTime, eventTime]);

  const handleRemove = () => {
    Cookies.set('eventBarDismissed', 'true', { expires: eventTime });
    setShowEventbar(false);
  };

  if (!showEventBar) {
    return null;
  }

  return (
    <div className="container mx-auto bg-black text-white py-4 px-4 header-event">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center">
            <div className="text-center">
              <div className="md:block hidden">
                <RichText field={HeaderDescription} />
              </div>
              <div className="md:hidden">
                <RichText field={MobileDescription} />
              </div>
            </div>
          </div>
        </div>
        <button className="ml-4 text-white hover:text-red-700" onClick={handleRemove}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default HeaderEventBar;
