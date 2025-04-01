import { RichText } from '@sitecore-jss/sitecore-jss-react';

import { SecondaryBannerProps } from './SecondaryBanner.types';
import { cn } from '@/utils/cn';
import { SIZE, THEME } from '@/utils/constants';
import CTALink from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/core/atoms/ui/Accordion';
import DAMImage from '@/core/atoms/Image/Image';
import { PiCaretDownThin, PiCaretUpThin } from 'react-icons/pi';
import { useState, memo } from 'react';
import Link from '@/core/atoms/Link/Link';
import useImageFormat from '@/hooks/useImageFormat';

const SecondaryBanner: React.FC<SecondaryBannerProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const id = props?.params?.RenderingIdentifier;
  const { HeadingTag, CTAColor, CTASize } = props?.params || {};
  const {
    Title,
    Description,
    CTA,
    Image: DesktopImage,
    SecondaryCTA,
    RightColumnTitle,
    RelatedLinks,
    RightColumnBackgroundColor,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  } = props?.rendering?.fields || {};

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  const toggleAccordion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <section
      key={id}
      className="container mx-auto mb-5 relative overflow-hidden w-full h-full px-0"
    >
      <div>
        <div className="p-0 min-w-screen md:flex md:gap-0">
          <div
            className={cn(
              'bg-dark-gray text-white md:w-70p md:p-10 relative lg:p-14 lg:pr-0  md:flex  xl:after:w-0 md:pr-0',
              Description?.value && Description?.value?.length < 200 ? 'lg:pb-32 ' : ''
            )}
          >
            <div className="flex flex-col w-full pb-5">
              <div
                className={cn('px-5 pt-5 md:px-1', {
                  'xl:w-1/2': desktopImage?.url || tabletImage?.url || mobileImage?.url,
                })}
              >
                <RichText
                  field={Title}
                  tag={HeadingTag || 'h2'}
                  className="pb-5 mb-4 text-4.5xl md:text-40 border-white border-b-2 md:border-none text-wrap font-latoLight"
                />
                <RichText
                  field={Description}
                  className={cn('hidden md:flex md:flex-col mb-4 text-base lg:text-lg gap-4')}
                />
              </div>
              <div className="md:flex md:flex-col px-5 md:px-0">
                <CTALink
                  field={CTA}
                  variant={CTAColor as LinkVariant}
                  size={CTASize as SIZE}
                  className="hover:underline font-normal hover:font-bold p-0 md:py-3 md:px-6 text-sm hover:filter-none after:content-['>'] md:after:content-[''] w-fit"
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                />
                <CTALink
                  field={SecondaryCTA}
                  className="w-fit text-white md:mt-7 hover:font-normal hover:filter-none after:content-['>'] ml-5 md:ml-0 text-base no-underline hover:underline"
                />
              </div>
            </div>
            <div className="hidden xl:flex items-center justify-center absolute -right-2.5  top-56 -translate-y-1/2">
              {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
                <DAMImage
                  alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
                  desktopSrc={desktopImage?.url}
                  tabletSrc={tabletImage?.url}
                  mobileSrc={mobileImage?.url}
                  className="w-387 h-293 object-cover"
                />
              ) : null}
            </div>
          </div>
          <div
            className={cn('hidden md:block py-10 pt-15 lg:py-19 md:px-19 md:w-30p -ml-px', {
              'bg-dark-gray text-white':
                RightColumnBackgroundColor?.value === THEME.DARK ||
                RightColumnBackgroundColor?.value?.length === 0,
              'bg-tonal-gray text-black': RightColumnBackgroundColor?.value === THEME.LIGHT,
            })}
          >
            <h2 className=" mb-5 text-2xl uppercase font-normal pt-3">{RightColumnTitle?.value}</h2>
            <div className="mb-3">
              {RelatedLinks?.map((item) => {
                return (
                  item?.fields?.CTA?.value?.text && (
                    <div
                      key={item?.id}
                      className={`${item?.fields?.CTA?.value?.text != '' ? "pr-3 mb-2.6 w-fit after:content-['>'] hover:underline" : ''}`}
                    >
                      <Link
                        variant={LinkVariant.OUTLINE}
                        field={item?.fields?.CTA}
                        className="text-base font-bold border-0"
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
          <div className="flex md:hidden bg-tonal-gray text-black w-full drop-shadow-button [&>button]:p-5">
            <div className="flex justify-between w-full px-5">
              <Accordion
                type="single"
                collapsible
                className="w-full text-base no-underline text-left"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger
                    className="w-full text-base hover:no-underline"
                    onClick={toggleAccordion}
                  >
                    <h2 className="no-underline text-lg font-latoLight md:font-latoRegular">
                      {RightColumnTitle?.value}
                    </h2>
                    <div className="md:hidden text-dark-gray font-latoLight">
                      {isExpanded ? <PiCaretUpThin size={30} /> : <PiCaretDownThin size={30} />}
                    </div>
                  </AccordionTrigger>
                  {props?.rendering?.fields?.RelatedLinks?.map((item) => {
                    return (
                      <AccordionContent
                        key={item?.id}
                        className="font-bold text-base text-dark-gray pb-2.6"
                      >
                        <Link
                          variant={LinkVariant.OUTLINE}
                          field={item?.fields?.CTA}
                          className="mr-3 after:content-['>'] border-0"
                        />
                      </AccordionContent>
                    );
                  })}
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default memo(SecondaryBanner);
