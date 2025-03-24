import { MOBILE_MAX_WIDTH, TABLET_MAX_WIDTH } from '@/utils/constants';
import { useState, useEffect } from 'react';

export enum DeviceType {
  Mobile,
  Tablet,
  Desktop,
  Null,
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.Desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MOBILE_MAX_WIDTH) {
        setDeviceType(DeviceType.Mobile);
      } else if (window.innerWidth < TABLET_MAX_WIDTH) {
        setDeviceType(DeviceType.Tablet);
      } else {
        setDeviceType(DeviceType.Desktop);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
}

export function useImprovedDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.Null);

  useEffect(() => {
    const determineDeviceType = (): DeviceType => {
      if (typeof window === 'undefined' || window.innerWidth == null) {
        return DeviceType.Null; // Handle cases where window or innerWidth is not available
      }

      if (window.innerWidth < MOBILE_MAX_WIDTH) {
        return DeviceType.Mobile;
      }

      if (window.innerWidth < TABLET_MAX_WIDTH) {
        return DeviceType.Tablet;
      }

      return DeviceType.Desktop;
    };

    const handleResize = () => {
      setDeviceType(determineDeviceType());
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
}
