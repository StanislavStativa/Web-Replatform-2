import { useI18n } from 'next-localization';
import { MobileContainerType, StatementType } from './StatementPeriod.type';

const StatementPeriodMobileContainer: React.FC<MobileContainerType> = (props) => {
  const { type, order, date, po, referraltotal, spendTotal } = props;
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 border-b border-border-gray pb-6">
      <div className="flex gap-113 items-center">
        <p className="text-xs font-bold leading-4 text-dark-gray min-w-78">
          {t('Rewards_OrderNumber')}
        </p>
        <p className="text-base font-normal leading-6 text-dark-gray underline">{order}</p>
      </div>
      <div className="flex gap-113 items-center">
        <p className="text-xs font-bold leading-4 text-dark-gray min-w-78">{t('Rewards_Date')}</p>
        <p className="text-base font-normal leading-6 text-dark-gray">{date}</p>
      </div>
      <div className="flex gap-113 items-center">
        <p className="text-xs font-bold leading-4 text-dark-gray min-w-78">{t('Rewards_PO')}</p>
        <p className="text-base font-normal leading-6 text-dark-gray">{po}</p>
      </div>
      <div className="flex gap-113 items-center">
        <p className="text-xs font-bold leading-4 text-dark-gray min-w-78">
          {type === StatementType.REFERRAL ? t('Rewards_ReferalTotal') : t('Rewards_SpendTotal')}
        </p>
        <p className="text-base font-normal leading-6 text-dark-gray">
          {type === StatementType.REFERRAL ? referraltotal : spendTotal}
        </p>
      </div>
    </div>
  );
};
export default StatementPeriodMobileContainer;
