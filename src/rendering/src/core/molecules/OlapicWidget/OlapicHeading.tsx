import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type OlapicWidgetProps } from './OlapicWidget.type';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';

const OlapicHeading = (props: OlapicWidgetProps) => {
  const { fields, params } = props?.rendering || {};
  const { Title, Description, OlapicType } = fields || {};
  const { HeadingSize, HeadingTag } = props?.rendering?.params || {};
  const isProductPage = Boolean(props?.rendering?.params?.IsProductPage);
  return (
    <div
      className={cn('mb-7 text-center px-4 ', {
        'pt-16 md:pt-24': !isProductPage,
        'pt-16 md:pt-0': isProductPage,
      })}
    >
      {Title && (
        <Text
          field={Title}
          tag={params?.HeadingTag || 'h2'}
          className={cn(' mb-3.5  md:mb-5', getHeadingStyles(HeadingSize, HeadingTag))}
        />
      )}
      {OlapicType?.value !== 'Gallery' && Description && (
        <RichText field={Description} className="text-base mb-4 md:text-lg" />
      )}
    </div>
  );
};

export default OlapicHeading;
