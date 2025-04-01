import { useI18n } from 'next-localization';
import RewardsStatementsTitle from './RewardsStatementsTitle';
import { RewardsStatementApi, RewardsStatementsProps } from './RewardsStatemets.type';
import StatementPeriod from '../StatementPeriod/StatementPeriod';
import { useAtom } from 'jotai';
import {
  monthAtom,
  referralTotalAtom,
  rewardIdAtom,
  showStatementAtom,
  spendTotalAtom,
} from '@/data/atoms/rewards';

import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useEffect, useState } from 'react';

const RewardsStatements: React.FC<RewardsStatementsProps> = (props) => {
  const id = props.params.RenderingIdentifier;
  const { EnableProUsers } = props.rendering.fields;
  const { t } = useI18n();

  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [showStatement, setShowStatement] = useAtom<boolean>(showStatementAtom);
  const [, setMonth] = useAtom<string | null>(monthAtom);
  const [, setRewardId] = useAtom<string | undefined>(rewardIdAtom);
  const [, setSpendTotal] = useAtom<string | undefined>(spendTotalAtom);
  const [, setReferralTotal] = useAtom<string | undefined>(referralTotalAtom);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  const { data } = useQuery({
    queryKey: ['getRewardsStatement'],
    queryFn: () => MyAccountService.myAccountGetRewardStatements(),
    enabled: isAuthenticated,
  });

  if (!EnableProUsers.value) {
    return null;
  }

  if (!hasMounted) {
    return null;
  }

  const handleOpenShowStatement = (item: RewardsStatementApi) => {
    setMonth(item.fiText.split(' ')[0]);
    setRewardId(item.id);
    setShowStatement(true);
  };
  const handleCloseShowStatement = () => {
    setSpendTotal(undefined);
    setReferralTotal(undefined);
    setShowStatement(false);
  };

  return (
    <>
      <div className={`pb-17  md:py-16 component container ${props.params.styles}`} id={id}>
        <div
          className={cn('px-5', {
            hidden: !showStatement,
          })}
        >
          <button
            className={cn(`text-xs font-bold mb-3`, {
              hidden: !showStatement,
            })}
            onClick={handleCloseShowStatement}
          >
            <span>{`<`}</span> {t('Common_Back')}
          </button>
        </div>
        <div className="component-content flex flex-col gap-6 px-5">
          <RewardsStatementsTitle {...props} />
          {showStatement ? (
            <>
              <StatementPeriod />
            </>
          ) : (
            <div>
              <div className="w-full hidden md:flex bg-tonal-gray py-3.7 pl-14.6 text-xs leading-4 font-medium font-latoBold text-dark-gray rounded-md">
                <p>{t('Rewards_Month')}</p>
              </div>
              <div className="flex flex-col gap-9 pt-4.9 md:pl-13.8">
                {data?.documents?.map((item: RewardsStatementApi) => {
                  return (
                    <div
                      key={item.id}
                      className="pb-6 md:pb-0 flex gap-113 border-b border-border-gray md:border-none"
                    >
                      <p className="py-1.5 flex md:hidden text-xs font-latoBold font-bold text-dark-gray">
                        {t('Rewards_Month')}
                      </p>
                      <button
                        className={cn(
                          'text-base font-normal font-latoSemiBold text-dark-gray underline cursor-pointer',
                          props?.params?.IsCTATextInCaps && 'uppercase'
                        )}
                        onClick={() => handleOpenShowStatement(item)}
                      >
                        {item.fiText}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default RewardsStatements;
