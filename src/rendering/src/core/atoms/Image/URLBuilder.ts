import { GenericService } from '@/api';
import {
  AdobeImageDeviceSmartCropURLProps,
  AdobeImageURLProps,
  DEVICE_TYPE,
  DeviceSmartCropProps,
  DeviceTypeProps,
} from './URLBuilder.types';
import { useQuery } from '@tanstack/react-query';

export const getAdobeImageDeviceSmartCropURL = ({
  fieldValue,
  deviceType,
  smartCropFormat = '{0}',
}: AdobeImageDeviceSmartCropURLProps) => {
  if (!fieldValue || !fieldValue.trim()) {
    return '';
  }
  return getAdobeImageURL({
    imageName: fieldValue,
    useDeviceSmartCrops: false,
    smartCropFormat,
    deviceType,
  });
};

const applyMobileSmartCrops = (imageName: string, smartCropFormat: string) => {
  const deviceType = detectDeviceType({
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  });
  return getDeviceSmartCrop({ imageName, deviceType, smartCropFormat });
};

const detectDeviceType = ({ userAgent }: DeviceTypeProps) => {
  if (userAgent && userAgent.includes('Mobile')) {
    return DEVICE_TYPE.MOBILE;
  } else if (userAgent && userAgent.includes('Tablet')) {
    return DEVICE_TYPE.TABLET;
  } else {
    return DEVICE_TYPE.DESKTOP;
  }
};

const getDeviceSmartCrop = ({
  imageName,
  deviceType,
  smartCropFormat = '${0}',
}: DeviceSmartCropProps) => {
  let imageNameWithSmartCrop = imageName;

  // if (!smartCropFormat.includes('{0}')) {
  //   smartCropFormat += '{0}';
  // }

  switch (deviceType) {
    case DEVICE_TYPE.MOBILE:
      imageNameWithSmartCrop += smartCropFormat
        ? `:${smartCropFormat.replace('{0}', 'Mobile')}`
        : '';
      break;
    case DEVICE_TYPE.TABLET:
      imageNameWithSmartCrop += smartCropFormat
        ? `:${smartCropFormat.replace('{0}', 'Tablet')}`
        : '';
      break;
    case DEVICE_TYPE.DESKTOP:
    default:
      imageNameWithSmartCrop += smartCropFormat
        ? `:${smartCropFormat.replace('{0}', 'Desktop')}`
        : '';
      break;
  }
  return imageNameWithSmartCrop;
};

const GetAltText = (imageName: string) => {
  const imageEndIndex = imageName?.includes(':') ? imageName?.lastIndexOf(':') : imageName?.length;
  const { data } = useQuery({
    queryKey: [`getAltText-${imageName}`],
    queryFn: () => GenericService.genericGetImageAltText(imageName.substring(0, imageEndIndex)),
    enabled: !!imageName,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  return data || '';
};

export const getAdobeImageURL = ({
  imageName,
  useDeviceSmartCrops = false,
  width = null,
  height = null,
  smartCropFormat = '{0}',
  deviceType = null,
  isContent = false,
}: AdobeImageURLProps) => {
  if (!imageName) {
    return { url: '', altText: '' };
  }
  const altTextValue: string = imageName !== '' ? GetAltText(imageName) : '';

  let rootURL = isContent ? process.env.NEXT_PUBLIC_CONTENT_URL : process.env.NEXT_PUBLIC_IMAGE_URL;
  if (!rootURL || rootURL.trim() === '') {
    throw new Error(
      "Missing AEM dynamic media root property 'Adobe_DynamicMedia_ImageRootUrl' from the current configuration settings."
    );
  }

  if (!rootURL.endsWith('/')) {
    rootURL += '/';
  }

  let queryString = '';

  // Check if the image name contains a query string
  const questionMarkIndex = imageName.indexOf('?');
  if (questionMarkIndex > -1) {
    queryString = imageName.substring(questionMarkIndex);
    imageName = imageName.substring(0, questionMarkIndex);
  }

  // Append width and height to the query string if provided
  if (width !== null) {
    queryString += (queryString === '' ? '?' : '&') + 'wid=' + width;
  }
  if (height !== null) {
    queryString += (queryString === '' ? '?' : '&') + 'hei=' + height;
  }

  queryString += (queryString === '' ? '?' : '&') + 'fmt=webp';

  // Apply smart crops if necessary
  if (deviceType !== null) {
    imageName = getDeviceSmartCrop({ imageName, deviceType, smartCropFormat });
  } else if (useDeviceSmartCrops && questionMarkIndex === -1) {
    imageName = applyMobileSmartCrops(imageName, smartCropFormat);
  }

  return {
    url: rootURL + decodeURIComponent(imageName).replaceAll(' ', '%20') + queryString,
    altText: altTextValue,
  };
};
