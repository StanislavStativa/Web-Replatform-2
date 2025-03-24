export enum DEVICE_TYPE {
  DESKTOP = 'Desktop',
  TABLET = 'Tablet',
  MOBILE = 'Mobile',
}

export interface DeviceSmartCropProps {
  imageName: string;
  deviceType?: DEVICE_TYPE | null;
  smartCropFormat?: string;
}

export interface AdobeImageURLProps extends DeviceSmartCropProps {
  useDeviceSmartCrops?: boolean;
  width?: number | null;
  height?: number | null;
  isContent?: boolean;
}

export interface AdobeImageDeviceSmartCropURLProps {
  fieldValue: string;
  deviceType: DEVICE_TYPE;
  smartCropFormat?: string;
}

export interface DeviceTypeProps {
  userAgent: string | string[];
}
