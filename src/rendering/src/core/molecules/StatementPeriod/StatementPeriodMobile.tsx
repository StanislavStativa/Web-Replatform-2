import { useI18n } from 'next-localization';
import { ApiRequiredData, StatementType, TableDataType } from './StatementPeriod.type';
import StatementPeriodMobileContainer from './StatementPeriodMobileContainer';
import { useAtom } from 'jotai';
import { monthAtom } from '@/data/atoms/rewards';

const StatementPeriodMobile: React.FC<ApiRequiredData> = (props) => {
  const { t } = useI18n();
  const { referralDetails, referralTotal, spendDetails, spendTotal } = props;

  const [month] = useAtom<string | null>(monthAtom);
  return (
    <div className="flex flex-col md:hidden">
      <div className=" flex flex-col gap-4">
        <h5 className="text-xl leading-6 font-semibold text-dark-gray uppercase">
          {month}
          <span className="ml-1">{t('Rewards_TotalSpend')}</span>
        </h5>
        {spendDetails && spendDetails.length > 0 ? (
          <div className="flex flex-col gap-9">
            {spendDetails?.map((data: TableDataType) => {
              return (
                <StatementPeriodMobileContainer
                  key={data.order}
                  {...data}
                  type={StatementType.SPEND}
                />
              );
            })}
            {spendDetails?.map((data: TableDataType) => (
              <StatementPeriodMobileContainer
                key={data.order}
                {...data}
                type={StatementType.SPEND}
              />
            ))}{' '}
          </div>
        ) : (
          <div className="border-b border-border-gray pb-6"></div>
        )}
      </div>
      <div className="flex gap-3.6 justify-end pt-7.6 pb-42">
        <p className="text-xs font-medium text-dark-gray">
          {month}
          <span className="ml-1">{t('Rewards_TotalSpend')}</span>
        </p>
        <p className="text-xs font-bold text-dark-gray">{spendTotal}</p>
      </div>

      <div className=" flex flex-col gap-4">
        <h5 className="text-xl leading-6 font-semibold text-dark-gray uppercase">
          {month}
          <span className="ml-1">{t('Rewards_TotalReferals')}</span>
        </h5>
        {referralDetails && referralDetails.length > 0 ? (
          <div className="flex flex-col gap-9">
            {referralDetails?.map((data: TableDataType) => {
              return (
                <StatementPeriodMobileContainer
                  key={data.order}
                  {...data}
                  type={StatementType.REFERRAL}
                />
              );
            })}
          </div>
        ) : (
          <div className="border-b border-border-gray pb-6"></div>
        )}
      </div>
      <div className="flex gap-3.6 justify-end pt-7.6 pb-42">
        <p className="text-xs font-medium text-dark-gray">
          {month}
          <span className="ml-1">{t('Rewards_TotalReferals')}</span>
        </p>
        <p className="text-xs font-bold text-dark-gray">{referralTotal}</p>
      </div>
    </div>
  );
};
export default StatementPeriodMobile;
