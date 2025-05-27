import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';

const measureComponentHeight = (Component: React.ReactElement): Promise<number> => {
  return new Promise((resolve) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.height = 'auto'; // Let it take natural height
    tempDiv.style.width = '100%';
    document.body.appendChild(tempDiv);

    const root = ReactDOM.createRoot(tempDiv);
    root.render(Component);

    setTimeout(() => {
      const height = tempDiv.offsetHeight;
      document.body.removeChild(tempDiv);
      resolve(height);
    }, 0);
  });
};

export const useMeasureComponentHeight = (component: React.ReactElement) => {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getHeight = async () => {
      const measuredHeight = await measureComponentHeight(component);
      if (isMounted) setHeight(measuredHeight);
    };

    getHeight();

    return () => {
      isMounted = false;
    };
  }, [component]);

  return height;
};
