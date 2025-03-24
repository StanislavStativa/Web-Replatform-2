import React, { useEffect } from 'react';

/**
 * useClickOutside Hook
 * @param {*} callback
 * @returns ref which needs to be added on component, outside which we need to listen for Clicks
 */
const useNavigationClickOutside = (callback: () => void) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Registers the Click Event
  function registerClickEventListener() {
    window?.addEventListener('click', (event) => {
      if (!event.target) return;
      const dataset = (event.target as HTMLElement).dataset;
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        dataset.type !== 'primary-navigation-button'
      ) {
        callback();
      }
    });
  }

  // un-registers the Click Event
  function unRegisterClickEventListener() {
    window?.addEventListener('click', (event) => {
      if (event.target === ref.current) {
        callback();
      }
    });
  }

  useEffect(() => {
    registerClickEventListener();

    return () => {
      unRegisterClickEventListener();
    };
  }, []);

  return ref;
};

export default useNavigationClickOutside;
