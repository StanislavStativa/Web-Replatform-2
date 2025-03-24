import {
  CTAListProps,
  type AccountCategoryCardsProps,
} from '@/core/molecules/AccountCategoryCards/AccountCategoryCards.type';
import Image from '@/core/atoms/Image/Image';
import Link from '@/core/atoms/Link/Link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { CAN_CREATE_USER, IS_NET_PRO, IS_PROUSER } from '@/config';
import { CREATEUERCARDIDS } from '@/utils/constants';
import { FaRegLightbulb } from 'react-icons/fa';
import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';

const AccountCategoryCards = (props: AccountCategoryCardsProps) => {
  const { CardLists } = props?.rendering?.fields ?? {};
  const isProUser = Cookies.get(IS_PROUSER);
  const ntProUser = Cookies.get(IS_NET_PRO);
  const canCreateUser = Cookies.get(CAN_CREATE_USER);
  const [navLinks, setNavLinks] = useState<CTAListProps[] | []>([]);
  const [showConfirmationPage, setShowConfirmationPage] = useState(false);
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (CardLists) {
      const modifiedLinks: CTAListProps[] = [];

      CardLists?.forEach((item) => {
        const isProUserVisible = item?.fields?.IsVsibleOnlyForProUser?.value;
        const isNtProUserVisible = item?.fields?.IsVsibleOnlyForNT30ProUser?.value;

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
  }, [isProUser, CardLists, ntProUser]);

  useEffect(() => {
    if (router.isReady) {
      const param = sessionStorage.getItem('isPasswordChanged');
      if (param === 'true') setShowConfirmationPage(true);
      sessionStorage.removeItem('isPasswordChanged');
    }
  }, [router.isReady]);

  return (
    <div className="mt-4 w-full px-5 md:px-10">
      {showConfirmationPage && (
        <div className="flex items-center gap-x-1 bg-light-green mr-4 mb-2 p-3 mt-2">
          <FaRegLightbulb color="green" />
          <p>{t('SuccessMessages_ResetPassword')}</p>
        </div>
      )}
      {navLinks?.map((item, index) => {
        return (
          <div key={index} className="mb-6 w-full">
            <div className="py-6 px-4 md:py-10 md:px-8 rounded-xl border border-stone-300 flex items-start">
              <div className="mr-6">
                <Image
                  alt="category-card"
                  className="w-12 h-10 rounded-lg object-contain object-center"
                  desktopSrc={item?.fields?.Icon?.value?.src}
                  editable={false}
                />
              </div>
              <ul className="flex flex-col items-start gap-2">
                <li>
                  <p className="text-black   text-xl font-semibold leading-6">
                    {item?.fields?.Title?.value}
                  </p>
                </li>
                {item?.fields?.CardList?.filter((childitem) => {
                  const ctaIdMatches = CREATEUERCARDIDS?.includes(childitem.id as string);
                  const canCreateUserTrue = canCreateUser === 'true';
                  const isProUserTrue = isProUser === 'true';

                  // Render the item only if the CTA ID matches, canCreateUser is 'true', and isProUser is 'true'
                  if (ctaIdMatches && canCreateUserTrue && isProUserTrue) {
                    return true; // Render this item
                  }

                  // Return all other items (no filtering for other items)
                  return !ctaIdMatches; // Allow items that don't match the CTA ID
                }).map((childitem, index) => {
                  return (
                    <li
                      key={index}
                      className="text-black font-lato text-base font-normal leading-6"
                    >
                      <Link field={childitem?.fields?.CTA}></Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccountCategoryCards;
