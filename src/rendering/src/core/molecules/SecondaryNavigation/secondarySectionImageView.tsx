import Link from '@/core/atoms/Link/Link';
import Image from '@/core/atoms/Image/Image';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { ISecondarySectionImageView } from './SecondaryNavigation.types';
import { cn } from '@/utils/cn';
import useImageFormat from '@/hooks/useImageFormat';
import { useEffect } from 'react';

const SecondarySectionImageView: React.FC<ISecondarySectionImageView> = (props) => {
  const { primaryNavigationData, secondaryNavigationData } = props;

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: secondaryNavigationData?.fields.Image ??
      primaryNavigationData?.fields.Image ?? { value: '' },
    ImageSmartCropFormat: secondaryNavigationData?.fields.ImageSmartCropFormat ||
      primaryNavigationData?.fields.ImageSmartCropFormat || { value: '' },
    MobileImage: secondaryNavigationData?.fields.Image ??
      primaryNavigationData?.fields.MobileImage ?? { value: '' },
    TabletImage: secondaryNavigationData?.fields.Image ??
      primaryNavigationData?.fields.TabletImage ?? { value: '' },
  });

  const description = {
    value:
      secondaryNavigationData?.fields?.Description || primaryNavigationData?.fields?.Description,
  };

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          const element = node as HTMLElement;
          if (element.nodeType === 1 && element.matches('span[data-pin-href]')) {
            // Show or hide the Pinterest button
            element.style.zIndex = '99999999'; // Increase the z-index as needed
          }
        });
      });
    });

    // Observe the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn({
        'col-span-8': desktopImage?.url || tabletImage?.url || mobileImage?.url || description,
      })}
      id="navigation-secondarySection"
      tabIndex={-1}
    >
      {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
        primaryNavigationData?.fields?.NavigationType?.name === 'Links' ? (
          <Link field={primaryNavigationData?.fields?.CTA} tabIndex={-1} className="w-auto">
            <Image
              desktopSrc={desktopImage?.url}
              tabletSrc={tabletImage?.url}
              mobileSrc={mobileImage?.url}
              alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
            />
          </Link>
        ) : (
          <Image
            desktopSrc={desktopImage?.url}
            tabletSrc={tabletImage?.url}
            mobileSrc={mobileImage?.url}
            alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
          />
        )
      ) : null}
      {description && (
        <div className="pt-2">
          <Text field={description.value} />
        </div>
      )}
    </div>
  );
};

export default SecondarySectionImageView;
