import Link from '@/core/atoms/Link/Link';
import { PRICING_TIER, RewardsCardProps } from './RewardsCard.type';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { PROTERMSOFPAYMENT, SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, useState } from 'react';
import Image from '@/core/atoms/Image/Image';
import Cookies from 'js-cookie';
import { CUST_NAME, CUST_NUM, IS_NET_PRO, IS_PROUSER, PRICE_GP } from '@/config';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useAtom } from 'jotai';
import { MyAccountService } from '@/api/services/MyAccountService';
import { useQuery } from '@tanstack/react-query';

const RewardsCard: React.FC<RewardsCardProps> = (props) => {
  const id = props?.params?.RenderingIdentifier ?? {};
  const {
    Title,
    Description,
    CTA,
    EnableProUsers,
    Diamond_Pro,
    Gold_Pro,
    Platinum_Pro,
    Silver_Pro,
  } = props?.rendering?.fields ?? {};
  const { t } = useI18n();

  const [hasMounted, setHasMounted] = useState(false);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const ntProUser = Cookies.get(IS_NET_PRO);
  const CustomerNumber = Cookies.get(CUST_NUM);
  const IsProUser = Cookies.get(IS_PROUSER);
  const PricingGroupTier = Cookies.get(PRICE_GP);
  const CustomerName = Cookies.get(CUST_NAME);

  const { data: billingStatementData } = useQuery({
    queryKey: ['getBillingStatementData'],
    queryFn: () => {
      return MyAccountService.myAccountGetStatements();
    },
  });
  const proTermsArray = [
    PROTERMSOFPAYMENT.NETTHIRTY,
    PROTERMSOFPAYMENT.NETFOURTYFIVE,
    PROTERMSOFPAYMENT.NETNINENTY,
    PROTERMSOFPAYMENT.NETZERO,
  ];
  useEffect(() => {
    if (ntProUser && Object.values(proTermsArray).includes(ntProUser.trim() as PROTERMSOFPAYMENT)) {
      setShowCreditDetails(true);
    } else {
      setShowCreditDetails(false);
    }
  }, [ntProUser]);
  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  if (!hasMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (IsProUser === 'true' && EnableProUsers.value) {
    let imageSrc;
    let userType;
    switch (PricingGroupTier) {
      case PRICING_TIER.SILVER: {
        imageSrc = Silver_Pro;
        userType = t('Rewards_Silver');
        break;
      }
      case PRICING_TIER.GOLD: {
        imageSrc = Gold_Pro;
        userType = t('Rewards_Gold');
        break;
      }
      case PRICING_TIER.PLATINUM: {
        imageSrc = Platinum_Pro;
        userType = t('Rewards_Platinum');
        break;
      }
      case PRICING_TIER.DIAMOND: {
        imageSrc = Diamond_Pro;
        userType = t('Rewards_Diamond');
        break;
      }
      default: {
        imageSrc = undefined;
        userType = '';
      }
    }

    return (
      <section
        className={`component ${props?.params?.styles} px-5 md:px-10 pb-17  md:py-14`}
        id={id}
      >
        <div className="flex flex-col lg:flex-row gap-12 items-center pt-8.5 pb-8 lg:pt-5.5 lg:pb-5.6 lg:pl-8 bg-tonal-gray rounded-xl">
          <div className="flex flex-col lg:flex-row items-center gap-9">
            <div className="relative">
              <Image field={imageSrc} />
              <p className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-base text-dark-gray font-normal">
                {userType}
              </p>
            </div>
            <div className="flex flex-col gap-1.7 items-center lg:items-start">
              <div className="flex flex-col gap-3 items-center lg:items-start">
                <Text
                  field={Title}
                  tag="p"
                  className="text-base font-normal leading-6 text-dark-gray font-latoRegular"
                />
                <p className="text-5xl font-light font-latoLight leading-58 text-dark-gray">
                  {Description?.value}
                </p>
                <h1 className="text-base font-normal leading-6 text-dark-gray font-latoRegular">
                  {CustomerName}
                </h1>
              </div>
              <h1 className="text-xs leading-4 font-medium font-latoSemiBold text-dark-gray">
                {t('Rewards_CustomerID')}: {CustomerNumber}
              </h1>
              {showCreditDetails && (
                <>
                  <h1 className="text-xs leading-4 font-medium font-latoSemiBold text-dark-gray">
                    {t('label_Balance')}:{' '}
                    {billingStatementData?.documents?.[0]?.zzcustom?.balance === '' ||
                    !billingStatementData?.documents?.[0]?.zzcustom?.balance
                      ? `$0.00`
                      : billingStatementData?.documents?.[0]?.zzcustom?.balance}
                  </h1>
                  <h1 className="text-xs leading-4 font-medium font-latoSemiBold text-dark-gray">
                    {t('label_Available_Credit')}:{' '}
                    {billingStatementData?.documents?.[0]?.zzcustom?.availableCredit === '' ||
                    !billingStatementData?.documents?.[0]?.zzcustom?.availableCredit
                      ? `$0.00`
                      : billingStatementData?.documents?.[0]?.zzcustom?.availableCredit}
                  </h1>
                  <h1 className="text-xs leading-4 font-medium font-latoSemiBold text-dark-gray">
                    {t('label_Credit_Limit')}:{' '}
                    {billingStatementData?.documents?.[0]?.zzcustom?.creditLimit === '' ||
                    !billingStatementData?.documents?.[0]?.zzcustom?.creditLimit
                      ? `$0.00`
                      : billingStatementData?.documents?.[0]?.zzcustom?.creditLimit}
                  </h1>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-y-4.5 items-center lg:items-start w-fit">
              <p className="text-xs leading-4 font-medium font-latoSemiBold text-center lg:text-start max-w-44 md:max-w-65 text-dark-gray">
                {t('Rewards_RewardsDescription')}
              </p>
              <Link
                field={CTA}
                variant={LinkVariant.BLACK}
                size={SIZE.SMALL}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
              />
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
};
export default RewardsCard;
