import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { DEVICE_TYPE } from '@/core/atoms/Image/URLBuilder.types';
import { ImageFormatType } from '@/core/molecules/HeroBanner/HeroBanner.types';

const useImageFormat = ({
  BannerImage,
  ImageSmartCropFormat,
  MobileImage,
  TabletImage,
  useDeviceSmartCrops,
  deviceType,
}: ImageFormatType) => {
  const desktopImage = getAdobeImageURL({
    imageName: BannerImage?.value,
    deviceType: deviceType ? DEVICE_TYPE.DESKTOP : null,
    smartCropFormat: ImageSmartCropFormat?.value,
    useDeviceSmartCrops: useDeviceSmartCrops ? true : undefined,
  });

  const tabletImage = getAdobeImageURL({
    imageName: TabletImage && TabletImage?.value ? TabletImage?.value : BannerImage?.value,
    deviceType: deviceType ? null : DEVICE_TYPE.TABLET,
    smartCropFormat: ImageSmartCropFormat?.value,
    useDeviceSmartCrops: useDeviceSmartCrops ? undefined : true,
  });

  const mobileImage = getAdobeImageURL({
    imageName: MobileImage && MobileImage?.value ? MobileImage?.value : BannerImage?.value,
    deviceType: deviceType ? null : DEVICE_TYPE.MOBILE,
    smartCropFormat: ImageSmartCropFormat?.value,
    useDeviceSmartCrops: useDeviceSmartCrops ? undefined : true,
  });

  return {
    desktopImage,
    tabletImage,
    mobileImage,
  };
};
export default useImageFormat;
