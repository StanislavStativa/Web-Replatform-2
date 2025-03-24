/**
 * Renders the secondary left navigation component.
 * @param props - The props for the secondary left navigation component.
 * @param props.items - The items to display in the secondary left navigation.
 * @param props.activeItem - The currently active item in the secondary left navigation.
 * @param props.onItemClick - A callback function that is called when an item in the secondary left navigation is clicked.
 */

import Link from '@/core/atoms/Link/Link';
import { SecondaryLinksNav, type SecondaryLinkProps } from './LeftNavigation.types';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { CAN_CREATE_USER, IS_PROUSER } from '@/config';
import { CREATEUSERIDS } from '@/utils/constants';

const SecondaryLeftNavigation: React.FC<SecondaryLinkProps> = ({
  SecondaryLinks,
  MyAccountPages,
}): JSX.Element => {
  const pathName = usePathname();
  const isProUser = Cookies.get(IS_PROUSER);
  const canCreateUser = Cookies.get(CAN_CREATE_USER);
  const [navLinks, setNavLinks] = useState<SecondaryLinksNav[] | []>([]);

  useEffect(() => {
    if (SecondaryLinks?.targetItems) {
      const modifiedLinks: SecondaryLinksNav[] = [];

      SecondaryLinks.targetItems.forEach((item) => {
        const isProUserVisible = item?.IsVsibleForProUser?.jsonValue?.value;

        // Filter main links
        if (isProUser === undefined || isProUser === 'false') {
          if (!isProUserVisible) {
            modifiedLinks?.push(item);
          }
        } else {
          modifiedLinks?.push(item);
        }
      });

      const authorizedLinks = modifiedLinks.filter((link) => {
        const ctaIdMatches = CREATEUSERIDS?.includes(link?.CTA?.jsonValue?.value?.id as string);
        const isCustomerFalse = canCreateUser === 'false';

        return !(ctaIdMatches && isCustomerFalse);
      });

      setNavLinks(authorizedLinks);
    }
  }, [SecondaryLinks.targetItems, isProUser, canCreateUser]);

  return (
    <div>
      {navLinks?.map((secondaryItem) => {
        return (
          <div key={`secondary_item_${secondaryItem.CTA?.jsonValue?.value?.id}`}>
            {secondaryItem?.CTA?.jsonValue?.value?.text ? (
              <Link
                field={secondaryItem?.CTA?.jsonValue}
                className={cn(
                  'text-wrap lg:w-max no-underline py-2.5  text-dark-gray text-sm text-center lg:justify-center md:justify-start lg:text-left md:text-left',
                  {
                    'font-bold': pathName
                      .toLowerCase()
                      .includes(secondaryItem?.CTA?.jsonValue?.value?.href?.toLowerCase() ?? ''),
                  },
                  {
                    'text-base md:text-base': MyAccountPages === 'true',
                  }
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
export default SecondaryLeftNavigation;
