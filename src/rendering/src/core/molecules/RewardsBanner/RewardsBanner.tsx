import React from 'react';
import { type RewardsBannerProps } from '@/core/molecules/RewardsBanner/RewardsBanner.type';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { THEME } from '@/utils/constants';
import { getHeadingStyles } from '@/utils/StyleHeadings';

const RewardsBanner = (props: RewardsBannerProps): JSX.Element => {
  const {
    LeftSectionDescription,
    RightSectionDescription,
    LeftSectionTitle,
    RightSectionTitle,
    SectionTitle,
    SectionDescription,
  } = props?.rendering?.fields;

  const { BackgroundColor, HeadingTag, SectionHeadingTag } = props?.params;

  const BgColor = cn(
    {
      'bg-tonal-gray': BackgroundColor === THEME.LIGHT,
      'bg-dark-gray': BackgroundColor === THEME.DARK,
    },
    props?.params?.styles
  );

  const textStyles = cn('text-left', {
    'text-dark-gray': BackgroundColor === THEME.LIGHT,
    'text-white': BackgroundColor === THEME.DARK,
  });

  const leftH4Style =
    '[&_h4]:!text-lg [&_h4]:!font-bold [&_h4]:!mb-3 [&_h4]:!leading-5 md:[&_h4]:!text-2xl md:[&_h4]:!font-normal md:[&_h4]:!mb-4 ';

  const pTagStyle =
    '[&_p]:!text-base [&_p]:!font-normal [&_p]:!mb-4 md:[&_h2]:!mb-8 md:[&_p]:!mb-8 md:[&_p]:!text-xl';

  const RightH3Style = cn(
    "[&_h3]:!text-xl [&_h3]:!semibold [&_h3]:!mb-3 md:[&_h3]:!font_latoLight md:[&_h3]:!text-32 md:[&_h3]:!font-normal md:[&_h3]:!mb-5 md:[&_h3>div]:before:content-['|'] md:[&_h3>div]:before:px-5 md:[&_h3>div]:inline md:[h3>div]:!text-3xl [&_a]:!font-bold [&_a]:!text-xl [&_a]:!underline [&_a]:!underline-offset-2"
  );

  return (
    <div className={cn('container mx-auto py-14 px-0', BgColor, textStyles)}>
      {/* section Title and Description */}
      {SectionTitle?.value !== '' && (
        <Text
          className={cn(
            'font-normal mb-4 md:mb-8 text-center',
            getHeadingStyles(props?.params?.SectionHeadingTag, props?.params?.SectionHeadingSize),
            {
              'md:mb-16': SectionDescription?.value === '',
            },
            {
              'text-center md:font-normal': BackgroundColor === THEME.LIGHT,
            }
          )}
          field={SectionTitle}
          tag={HeadingTag || 'h1'}
        />
      )}
      {SectionDescription?.value !== '' && (
        <RichText
          className="text-center [&_a]:!font-bold [&_a]:!underline [&_a]:!underline-offset-2 md:!text-base md:mb-4"
          field={SectionDescription}
        />
      )}
      {/* LeftSection Title and Description */}
      <div className="lg:flex px-5">
        <div className="md:flex md:flex-col md:px-14 md:flex-1">
          {LeftSectionTitle?.value !== '' && (
            <Text
              className={cn(
                'font-latoLight font-normal mb-4 md:font-light md:leading-58 md:mb-8 text-left ',
                getHeadingStyles(props?.params?.HeadingTag, props?.params?.HeadingSize)
              )}
              field={LeftSectionTitle}
              tag={HeadingTag || 'h2'}
            />
          )}
          {LeftSectionDescription?.value !== '' && (
            <RichText
              className={cn('font-latoLight font-normal  ', leftH4Style, pTagStyle)}
              field={LeftSectionDescription}
              tag={SectionHeadingTag || 'h2'}
            />
          )}
        </div>
        {/* RightSection Title and Description */}
        <div className="md:flex md:flex-col md:px-14 md:flex-1">
          {RightSectionTitle?.value !== '' && (
            <Text
              className={cn(
                'font-latoLight font-normal mb-4 md:font-light md:leading-58 md:text-left md:mb-8 ',
                getHeadingStyles(props?.params?.HeadingTag, props?.params?.HeadingSize)
              )}
              field={RightSectionTitle}
              tag={HeadingTag || 'h2'}
            />
          )}
          {RightSectionDescription?.value !== '' && (
            <RichText
              className={cn(
                '[&_h2]:!mb-4 md:[&_h2]:!mb-8 [&_h3>div]:!font-latoLight md:[&_h3>div]:!font-light [&_li]:!pl-16 [&_li]:!bg-no-repeat ',
                RightH3Style,
                pTagStyle
              )}
              field={RightSectionDescription}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default RewardsBanner;
