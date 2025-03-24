import { IoMdInformationCircleOutline } from 'react-icons/io';
import { type ItemTitleProps } from './ItemTitle.types';
import { useI18n } from 'next-localization';
import { cn } from '@/utils/cn';
import { PRODUCT_TYPE } from '../CartItemCard/CartItemCard.types';
import { RichText, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';

const ItemTitle: React.FC<ItemTitleProps> = ({
  type,
  LineItemCount,
  LineItemTotal,
  isHovered,
  SampleModalAlertSummary = '',
}) => {
  const { t } = useI18n();
  const text: RichTextField = {
    value: SampleModalAlertSummary,
  };
  return (
    <div
      className={cn('flex items-start gap-4 lg:gap-8.5 flex-col lg:flex-row', {
        'lg:flex-col': isHovered,
      })}
    >
      <div className={cn('flex flex-col gap-2', { hidden: isHovered })}>
        <h4
          className={cn('text-2xl leading-7 font-normal text-dark-gray flex gap-1', {
            hidden: isHovered,
          })}
        >
          {type === PRODUCT_TYPE.SAMPLE ? t('Cart_Samples') : t('Cart_Items')}
          <span className={cn('hidden', { flex: isHovered })}>({LineItemCount})</span>
        </h4>

        <p
          className={cn('text-xs lg:text-base font-normal lg:leading-6 text-dark-gray flex gap-1', {
            hidden: isHovered,
          })}
        >
          <span>{LineItemCount}</span>
          <span>{LineItemCount > 1 ? 'Items' : 'Item'}</span>
          <span>${LineItemTotal?.toFixed(2)}</span>
        </p>
      </div>
      {type === PRODUCT_TYPE.SAMPLE ? (
        <div
          className={cn(
            'flex items-center gap-2.5 bg-tonal-gray rounded-md w-fit h-fit pt-1.7 pb-2 pl-2.6 pr-4.5',
            {
              'p-3 font-latoRegular': isHovered,
            }
          )}
        >
          <IoMdInformationCircleOutline width={15} height={15} />
          <RichText className={cn('text-xs text-start text-dark-gray')} field={text} />
        </div>
      ) : null}
    </div>
  );
};
export default ItemTitle;
