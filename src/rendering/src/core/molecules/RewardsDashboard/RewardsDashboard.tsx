import Image from '@/core/atoms/Image/Image';
import { RewardsDashboardProps } from './RewardsDashboard.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { Progress } from '@/core/atoms/ui/progress';
import Link from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useI18n } from 'next-localization';
import { IS_PROUSER } from '@/config';
import Cookies from 'js-cookie';

const RewardsDashoard: React.FC<RewardsDashboardProps> = (props) => {
  const id = props.params.RenderingIdentifier;
  const { Icon, Title, CTA, SecondaryCTA, Description } = props.rendering.fields;
  const { t } = useI18n();
  const isProUser = Cookies.get(IS_PROUSER);

  const [hasMounted, setHasMounted] = useState(false);

  const [{ isAuthenticated }] = useAtom(authorizationAtom);

  const { data } = useQuery({
    queryKey: [`rewardsSummary`],
    queryFn: () => MyAccountService.myAccountGetRewardSummary(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  if (!hasMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isProUser === 'false' || isProUser === undefined) {
    return null;
  }

  const {
    // enjoyText,
    yearTotal,
    year,
    spendTotal,
    nextTierData,
    // nextLevelGroup,
    // nextLevel,
    referralTotal,
    // previousYear,
    priceGroup,
  } = data?.documents[0]?.zzcustom?.rewards ?? {};

  const progressValue =
    (parseInt(yearTotal) / (parseInt(yearTotal) + parseInt(nextTierData))) * 100;

  const updatedEnjoyText = Description?.value?.replace(/{MemberGroup}/g, priceGroup);

  return (
    <div className={`component ${props.params.styles} md:py-14`} id={id}>
      <div className="component-content mx-4 md:px-5">
        <div className="flex flex-col items-start pt-7 pb-8 md:pt-9 md:pb-13 px-4 md:px-8 w-full border border-border-gray rounded-xl gap-9 md:gap-26">
          <div className="flex gap-6 md:gap-6">
            <Image field={Icon} />
            <div className="flex flex-col gap-1.7">
              <Text
                field={Title}
                tag="h5"
                className="text-xl leading-6 font-semibold text-dark-gray font-latoSemiBold"
              />
              <p className="text-xs font-medium text-dark-gray">{updatedEnjoyText}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap md:flex-nowrap lg:pl-17">
            <div className="flex flex-col gap-2.6 w-full md:w-fit">
              <div className="border border-border-gray rounded-lg pt-2.8 px-7 pb-4.5 flex flex-col items-center justify-center gap-5.1">
                <div className="mb-2.5">
                  <p className="text-xs font-medium font-latoSemiBold text-dark-gray mb-0.7">
                    {year} {t('Rewards_TotalValue')}
                  </p>
                  <p className="text-40 font-light leading-48 text-dark-gray">{yearTotal}</p>
                </div>
                <Progress
                  value={progressValue}
                  className="[&>div]:bg-yellow-800 rounded-none max-w-248 max-h-9.1"
                />
                <p className="text-xs font-medium font-latoBold text-dark-gray text-center max-w-264">
                  {updatedEnjoyText}
                  <p>
                    <Link
                      field={SecondaryCTA}
                      className="font-bold no-underline ml-1"
                      isCTATextInCaps={props?.params?.IsCTATextInCaps}
                    />
                  </p>
                </p>
              </div>
              <div className="flex gap-2.6">
                <div className="border border-border-gray rounded-lg pt-3.5 px-5.6 pb-26 flex flex-col gap-2.5 items-center justify-center text-center w-1/2">
                  <p className="text-xs font-medium font-latoSemiBold text-dark-gray">
                    {year} {t('Rewards_TotalSpend')}
                  </p>
                  <p className="text-40 font-light leading-48 text-dark-gray">{spendTotal}</p>
                </div>
                <div className="border border-border-gray rounded-lg pt-3.5 px-5.6 pb-26 flex flex-col gap-2.5 items-center justify-center text-center w-1/2">
                  <p className="text-xs font-medium font-latoSemiBold text-dark-gray min-w-109">
                    {year} {t('Rewards_Referrals')}
                  </p>
                  <p className="text-40 font-light leading-48 text-dark-gray">{referralTotal}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.6 w-full md:w-fit">
              <div className="border border-border-gray rounded-lg text-center pt-3.5 px-5.6 pb-5.1 flex flex-col gap-3.5 items-center justify-center">
                <p className="text-xs font-medium font-latoSemiBold text-dark-gray">
                  {priceGroup} {t('Rewards_Reward')}
                </p>
                <p className="text-base font-bold font-latoBold max-w-205 md:max-w-109">
                  {t('Rewards_EarningsPercentage')}
                </p>
                <p className="text-xs font-medium font-latoSemiBold text-dark-gray max-w-205 md:max-w-109">
                  *{t('Rewards_EnrollPromoMessage')}
                </p>
                <Link
                  field={CTA}
                  variant={LinkVariant.BLACK}
                  size={SIZE.SMALL}
                  className="flex md:hidden"
                />
              </div>
              <div className="hidden border border-border-gray rounded-lg pt-3.5 pl-3.6 pr-4.5 md:flex flex-col gap-4 items-center text-center h-full">
                <p className="text-xs font-medium font-latoSemiBold text-dark-gray">
                  {t('Rewards_Statements')}
                </p>
                <Link field={CTA} variant={LinkVariant.BLACK} size={SIZE.SMALL} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RewardsDashoard;
