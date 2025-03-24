/**
 * Renders the left navigation menu component.
 * @param props - The props for the left navigation menu component.
 * @param props.items - An array of navigation items to display in the menu.
 * @param props.activeItem - The currently active navigation item.
 * @param props.onItemClick - A callback function to handle clicks on navigation items.
 */

import Link from '@/core/atoms/Link/Link';
import { ITypesTargetItem, type LeftNavigationProps } from './LeftNavigation.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';

import PrimaryLeftNavigation from './PrimaryLeftNavigation';
import LeftNavigationMobile from './LeftNavigationMobile';
import Heading from './Heading';
import Cookies from 'js-cookie';
import { IS_NET_PRO, IS_PROUSER } from '@/config';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { getHeadingStyles } from '@/utils/StyleHeadings';
const LeftNavigation = (props: LeftNavigationProps): JSX.Element => {
  const isProUser = Cookies.get(IS_PROUSER);
  const ntProUser = Cookies.get(IS_NET_PRO);
  const id = props?.params?.RenderingIdentifier;
  const { CTA, Title, Links } = props?.rendering?.fields?.data?.datasource ?? {};
  const { HeadingTag, HeadingSize, SectionHeadingTag, SectionHeadingSize, MyAccountPages } =
    props?.params ?? {};
  const [navLinks, setNavLinks] = useState<ITypesTargetItem[] | []>([]);

  useEffect(() => {
    if (Links?.targetItems) {
      const modifiedLinks: ITypesTargetItem[] = [];

      Links?.targetItems?.forEach((item) => {
        const isProUserVisible = item?.IsVsibleForProUser?.jsonValue?.value;
        const isNtProUserVisible = item?.IsVsibleOnlyForNT30ProUser?.jsonValue?.value;

        // Show item if both visibility flags are false
        if (!isProUserVisible && !isNtProUserVisible) {
          modifiedLinks.push(item);
        } else {
          // Check conditions for non-pro users
          if (isProUser === undefined || isProUser === 'false') {
            if (
              !isProUserVisible &&
              (!isNtProUserVisible || (ntProUser !== undefined && ntProUser !== 'Z000'))
            ) {
              modifiedLinks.push(item);
            }
          } else {
            // Show if pro user or NT30 user matches the conditions
            if (
              isProUserVisible ||
              (isNtProUserVisible && ntProUser !== undefined && ntProUser !== 'Z000')
            ) {
              modifiedLinks.push(item);
            }
          }
        }
      });

      setNavLinks(modifiedLinks);
    }
  }, [isProUser, Links?.targetItems, ntProUser]);

  return (
    <section
      key={id}
      className={cn(
        'container md:mb-10 md:pb-10 md:m-0 flex justify-between min-w-fit w-full h-full ',
        {
          ' md:pt-12 md:pl-8 lg:pl-0': MyAccountPages === 'true',
        }
      )}
    >
      <div
        className={cn(
          'custom-width hidden md:flex flex-col md:border-r border-light-border-gray md:mb-5',
          {
            'pr-0 border-white': MyAccountPages === 'true',
          }
        )}
      >
        {CTA ? (
          <Heading tag={SectionHeadingTag}>
            <Link
              field={CTA?.jsonValue}
              className={cn(
                `hover:font-bold lg:w-max no-underline font-normal  mb-5 !text-dark-gray text-32 hover:filter-none, ${getHeadingStyles(SectionHeadingSize, SectionHeadingTag)}`,
                {
                  'text-32 md:text-32 font-bold md:font-bold': MyAccountPages === 'true', //Don't change this specific css for OC pages side nav
                }
              )}
            />
          </Heading>
        ) : (
          <Text
            field={Title}
            tag={HeadingTag || 'h2'}
            className={cn(
              'mb-4 font-normal  !text-dark-gray text-32 ',
              getHeadingStyles(SectionHeadingSize, SectionHeadingTag)
            )}
          />
        )}
        <div className="hidden md:flex flex-col">
          {navLinks?.map((item) => {
            return (
              <PrimaryLeftNavigation
                CTA={item?.CTA}
                SecondaryLinks={item?.SecondaryLinks}
                Title={item?.Title}
                HeadingTag={HeadingTag}
                HeadingSize={HeadingSize}
                key={`primary_item_${item?.Title}`}
                MyAccountPages={MyAccountPages}
              />
            );
          })}
        </div>
      </div>
      <LeftNavigationMobile CTA={CTA} Links={Links} Title={Title} HeadingTag={HeadingTag} />
    </section>
  );
};
export default LeftNavigation;
