import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type NumberedImageListProps } from './NumberedImageList.type';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';
import Image from '@/core/atoms/Image/Image';
import useImageFormat from '@/hooks/useImageFormat';
import Link from 'next/link';
import { useI18n } from 'next-localization';

const NumberedImageList = (props: NumberedImageListProps) => {
  const {
    params: { HeadingSize, HeadingTag, NumberListFontSize, ShowImageCaption, ShowNumberList } = {},
    fields: {
      Title,
      Description,
      ImageCaption,
      ImageSmartCropFormat,
      Image: NumberedImage,
      CurrentNumber,
      TotalNumber,
      MobileImage,
      TabletImage,
    } = {},
  } = props?.rendering;

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: NumberedImage || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });

  const addLeadingZero =
    Number(CurrentNumber?.value) < 10 ? { value: `0${CurrentNumber?.value}` } : CurrentNumber;
  const styles = `${props?.params?.styles ?? ''}`.trimEnd();
  const { t } = useI18n();
  const handleBacktop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="container mx-auto">
      <div className="mt-10 md:mt-20">
        <div className="flex items-center gap-6 text-32 font-normal mb-6">
          {ShowNumberList && (
            <div
              className={cn(
                'text-dark-gray font-semibold tracking-3.6 md:tracking-4.8',
                ShowNumberList ? 'pr-6 border-r border-dark-gray' : ''
              )}
            >
              {CurrentNumber && (
                <Text
                  field={addLeadingZero}
                  tag={NumberListFontSize}
                  className={cn(
                    'text-dark-gray leading-8 font-semibold',
                    getHeadingStyles(NumberListFontSize, NumberListFontSize)
                  )}
                />
              )}
              <div className="text-base font-normal tracking-widest uppercase whitespace-nowrap">
                {'of '}
                {TotalNumber && <Text field={TotalNumber} />}
              </div>
            </div>
          )}
          {Title && (
            <Text
              field={Title}
              tag={HeadingTag}
              id={String(
                CurrentNumber?.value
                  ? CurrentNumber?.value + 'table-content'
                  : Math.random() + 'table-content'
              )}
              className={cn(
                'text-dark-gray font-semibold md:font-normal table-content',
                getHeadingStyles(HeadingSize, HeadingTag)
              )}
            />
          )}
        </div>
        <div>
          {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
            <Image
              className="mb-6"
              alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
              desktopSrc={desktopImage?.url}
              tabletSrc={tabletImage?.url}
              mobileSrc={mobileImage?.url}
            />
          ) : null}
          {ShowImageCaption && ImageCaption && (
            <RichText field={ImageCaption} className="text-xs font-medium text-dark-gray" />
          )}
          {Description && (
            <RichText field={Description} className={`mb-4 font-normal text-dark-gray ${styles}`} />
          )}

          <div className={`${styles}`}>
            <Link
              href="#"
              onClick={handleBacktop}
              className={`underline font-latoBold text-dark-gray`}
            >
              {t('Labels_Backtotop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberedImageList;
