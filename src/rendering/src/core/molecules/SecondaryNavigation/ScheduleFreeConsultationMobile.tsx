import { ISecondaryNavigationProps } from './SecondaryNavigation.types';
import Link from '@/core/atoms/Link/Link';
import DAMImage from '@/core/atoms/Image/Image';
import { cn } from '@/utils/cn';
import useImageFormat from '@/hooks/useImageFormat';

const ScheduleFreeConsultationMobile: React.FC<ISecondaryNavigationProps> = (props) => {
  const Buttons = props?.rendering?.fields?.MainRightNavigation
    ? props?.rendering?.fields?.MainRightNavigation[0]?.fields?.Buttons
    : [];
  const PopupImage = props?.rendering?.fields?.MainRightNavigation
    ? props?.rendering?.fields?.MainRightNavigation[0]?.fields?.PopupImage
    : null;
  const PopUpTitle = props?.rendering?.fields?.MainRightNavigation
    ? props?.rendering?.fields?.MainRightNavigation[0]?.fields?.PopUpTitle
    : undefined;

  const MobileImage = props?.rendering?.fields?.MainRightNavigation
    ? props?.rendering?.fields?.MainRightNavigation[0]?.fields?.MobileImage
    : null;
  const TabletImage = props?.rendering?.fields?.MainRightNavigation
    ? props?.rendering?.fields?.MainRightNavigation[0]?.fields?.TabletImage
    : null;
  const ImageSmartCropFormat = props?.rendering?.fields?.MainRightNavigation
    ? props?.rendering?.fields?.MainRightNavigation[0]?.fields?.ImageSmartCropFormat
    : null;

  const { tabletImage, mobileImage } = useImageFormat({
    BannerImage: PopupImage || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });
  return (
    <div className="flex flex-1 bg-tonal-gray max-h-48">
      {tabletImage?.url || mobileImage?.url ? (
        <DAMImage
          mobileSrc={mobileImage?.url}
          tabletSrc={tabletImage?.url}
          alt={tabletImage?.altText || mobileImage?.altText}
          className="h-full w-full object-cover"
        />
      ) : null}

      <div className="p-5">
        {PopUpTitle ? <p className={cn(`text-lg mb-4.5`)}>{PopUpTitle.value}</p> : null}

        <div className="flex flex-col gap-3.5">
          {Buttons?.map((button) => {
            return (
              <Link
                key={button?.id}
                field={button?.fields?.CTA}
                variant={button?.fields?.CTAColor?.value}
                size={button?.fields?.CTASize?.value}
                className="py-1 px-1.5"
                isCTATextInCaps={props.params.IsCTATextInCaps}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ScheduleFreeConsultationMobile;
