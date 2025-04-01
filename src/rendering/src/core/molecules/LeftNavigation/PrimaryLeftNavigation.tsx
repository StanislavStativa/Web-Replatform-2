/**
 * Renders the primary left navigation component.
 * @param props - The props for the primary left navigation component.
 * @param props.items - The navigation items to display.
 * @param props.activeItem - The currently active navigation item.
 * @param props.onItemClick - The callback function to call when a navigation item is clicked.
 */

import Link from '@/core/atoms/Link/Link';
import { type PrimaryLinkProps } from './LeftNavigation.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import SecondaryLeftNavigation from './SecondaryLeftNavigation';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { getHeadingStyles } from '@/utils/StyleHeadings';

const PrimaryLeftNavigation: React.FC<PrimaryLinkProps> = ({
  Title,
  SecondaryLinks,
  CTA,
  HeadingTag,
  HeadingSize,
  MyAccountPages,
}): JSX.Element => {
  const pathName = usePathname();

  return (
    <div className="py-2.5 pb-4">
      {CTA?.jsonValue?.value?.text ? (
        <Link
          field={CTA?.jsonValue}
          className={cn(
            'text-wrap justify-left lg:w-max no-underline lg:justify-center md:justify-start text-dark-gray hover:font-bold font-semibold mb-2.5 text-left',
            getHeadingStyles(HeadingSize, HeadingTag),
            {
              'font-bold': pathName.includes(CTA?.jsonValue?.value?.href ?? ''),
            }
          )}
        />
      ) : (
        <Text
          field={Title}
          tag={HeadingTag}
          className={cn(
            'text-wrap lg:w-max mb-2.5 font-semibold text-xl  text-dark-gray text-left',

            getHeadingStyles(HeadingSize, HeadingTag),
            {
              'text-xl md:text-xl ': MyAccountPages === 'true',
            }
          )}
        />
      )}
      <SecondaryLeftNavigation SecondaryLinks={SecondaryLinks} MyAccountPages={MyAccountPages} />
    </div>
  );
};
export default PrimaryLeftNavigation;
