import { useI18n } from 'next-localization';
import { ApiData, StatementType } from './StatementPeriod.type';
import StatementPeriodTable from './StatementPeriodTable';
import StatementPeriodMobile from './StatementPeriodMobile';
import { useAtom } from 'jotai';
import { monthAtom, referralTotalAtom, rewardIdAtom, spendTotalAtom } from '@/data/atoms/rewards';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api';
import { useEffect, useState } from 'react';
import { authorizationAtom } from '@/data/atoms/authorization';
import { cn } from '@/utils/cn';

const StatementPeriod = () => {
  const { t } = useI18n();

  const [month] = useAtom<string | null>(monthAtom);
  const [rewardId] = useAtom<string | undefined>(rewardIdAtom);
  const [, setSpend] = useAtom<string | undefined>(spendTotalAtom);
  const [, setReferral] = useAtom<string | undefined>(referralTotalAtom);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  const { data }: { data?: ApiData; error: unknown } = useQuery({
    queryKey: ['getRewardsStatementDetails'],
    queryFn: () => MyAccountService.myAccountGetRewardDetails(rewardId),
    enabled: isAuthenticated,
  });

  if (!hasMounted) {
    return null;
  }

  const { referralDetails, referralTotal, spendDetails, spendTotal } =
    data?.header?.zzcustom?.rewardDetails ?? {};

  if (data) {
    setSpend(spendTotal);
    setReferral(referralTotal);
  }

  return (
    <div>
      <div className="flex flex-col gap-9">
        <div className="flex-col gap-3.5 hidden md:flex">
          <StatementPeriodTable type={StatementType.SPEND} spendDetails={spendDetails} />
          <div
            className={cn('flex gap-4.9 justify-end items-center pr-200', {
              'pr-60': !spendTotal,
            })}
          >
            <p className="text-xs font-medium font-latoSemiBold text-dark-gray">
              {month}
              <span className="ml-1">{t('Rewards_TotalSpend')}</span>
            </p>
            <p className="text-xs font-bold text-dark-gray">{spendTotal}</p>
          </div>
        </div>
        <div className="flex-col gap-3.5 hidden md:flex">
          <StatementPeriodTable type={StatementType.REFERRAL} referralDetails={referralDetails} />
          <div
            className={cn('flex gap-4.9 justify-end items-center pr-200', {
              'pr-60': !referralTotal,
            })}
          >
            <p className="text-xs font-medium font-latoSemiBold text-dark-gray">
              {month}
              <span className="ml-1">{t('Rewards_TotalReferals')}</span>
            </p>
            <p className="text-xs font-bold text-dark-gray">{referralTotal}</p>
          </div>
        </div>
      </div>
      <StatementPeriodMobile
        referralDetails={referralDetails}
        referralTotal={referralTotal}
        spendDetails={spendDetails}
        spendTotal={spendTotal}
      />
    </div>
  );
};
export default StatementPeriod;
