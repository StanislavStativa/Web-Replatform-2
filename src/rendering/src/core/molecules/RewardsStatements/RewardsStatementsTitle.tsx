import Image from '@/core/atoms/Image/Image';
import { RewardsStatementsProps } from './RewardsStatemets.type';
import { useI18n } from 'next-localization';
import { useAtom } from 'jotai';
import {
  monthAtom,
  referralTotalAtom,
  showStatementAtom,
  spendTotalAtom,
} from '@/data/atoms/rewards';

const RewardsStatementsTitle: React.FC<RewardsStatementsProps> = (props) => {
  const { Title, Icon } = props.rendering.fields;
  const { t } = useI18n();

  const [showStatement] = useAtom(showStatementAtom);
  const [month] = useAtom<string | null>(monthAtom);
  const [spendTotal] = useAtom<string | undefined>(spendTotalAtom);
  const [referralTotal] = useAtom<string | undefined>(referralTotalAtom);

  return (
    <div className="border border-border-gray rounded-xl flex flex-col">
      <div className="flex items-center pt-6 pb-4.5 px-3.7 md:pt-7.6 md:pl-8.6 md:pb-41 w-full  gap-6">
        <Image field={Icon} className="hidden md:flex" />
        <h5 className="md:py-3 text-xl leading-6 font-semibold text-dark-gray font-latoSemiBold">
          {showStatement ? `${month} ${t('Rewards_Statements').slice(0, -1)}` : Title.value}
        </h5>
      </div>
      {showStatement ? (
        <div className="flex flex-col md:flex-row gap-4.9 pb-6 pl-3.7 lg:pl-107 md:pb-13.6">
          <div className="w-fit min-w-247 flex flex-col gap-2.6 items-center border border-border-gray rounded-xl pl-6.5 pb-26 pr-9.5 pt-3.5">
            <p className="text-xs font-medium text-dark-gray font-latoSemiBold">
              {month?.toUpperCase()} {t('Rewards_TotalSpend').toUpperCase()}
            </p>
            <h2 className="text-40 font-light leading-48 font-latoLight">
              {spendTotal ? spendTotal : '$0'}
            </h2>
          </div>
          <div className="w-fit min-w-247 flex flex-col gap-2.5 items-center border border-border-gray rounded-xl pl-6.5 pb-26 pr-9.5 pt-3.5">
            <p className="text-xs font-medium text-dark-gray font-latoSemiBold">
              {month?.toUpperCase()} {t('Rewards_TotalReferals').toUpperCase()}
            </p>
            <h2 className="text-40 font-light font-latoLight leading-48 ">
              {referralTotal ? referralTotal : '$0'}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default RewardsStatementsTitle;
