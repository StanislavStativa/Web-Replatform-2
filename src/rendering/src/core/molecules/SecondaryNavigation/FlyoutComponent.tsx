import Image from '@/core/atoms/Image/Image';
import Link from '@/core/atoms/Link/Link';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { IMainSectionProps } from './SecondaryNavigation.types';
import { cn } from '@/utils/cn';
import useImageFormat from '@/hooks/useImageFormat';
import { LinkVariant } from '@/core/atoms/Link/Link.type';

const FlyoutComponent: React.FC<IMainSectionProps> = (props) => {
  const { primaryNavigationData } = props;
  const { PopupImage, MobileImage, TabletImage, ImageSmartCropFormat } =
    primaryNavigationData?.fields ?? {};

  const { desktopImage } = useImageFormat({
    BannerImage: PopupImage || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });

  return (
    <div className="p-10 flex gap-10">
      <div className="min-w-80">
        <Image desktopSrc={desktopImage?.url} className="w-80 h-auto" alt={desktopImage?.altText} />
      </div>
      <div className="flex flex-col justify-center items-start">
        <Text
          className="text-dark-gray mb-3"
          field={primaryNavigationData?.fields?.PopUpTitle}
          tag="h4"
        />
        <RichText
          className="mb-8 text-base"
          field={primaryNavigationData?.fields?.PopUpDescription}
        />
        <div>
          {(primaryNavigationData?.fields?.Buttons || [])?.map((item, index) => {
            if (!item?.fields?.CTA?.value?.text) return;
            return (
              <Link
                key={item?.id}
                className={cn(
                  'py-3 px-6 text-sm border-dark-gray hover:border-black',
                  index + 1 !== primaryNavigationData?.fields?.Buttons?.length && 'mr-4',
                  {
                    'hover:font-latoBold ': LinkVariant.OUTLINE === item?.fields?.CTAColor?.value,
                    'transition-all duration-200 ease-in-out': true, // Smooth transitions
                  }
                )}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                field={item?.fields?.CTA}
                variant={item?.fields?.CTAColor?.value}
                size={item?.fields.CTASize?.value}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlyoutComponent;
