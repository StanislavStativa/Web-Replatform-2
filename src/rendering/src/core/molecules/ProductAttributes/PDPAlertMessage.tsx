import React from 'react';
import { ProductAttributesProps } from './ProductAttributes.types';
import Link from '@/core/atoms/Link/Link';
import { useI18n } from 'next-localization';

const PDPAlertMessage: React.FC<ProductAttributesProps> = (data) => {
  const { t } = useI18n();
  return (
    <>
      {data?.data?.IsClearance && (
        <div>
          <p className="text-red-500">{t('Labels_Clearance')}</p>
        </div>
      )}
      {data?.data?.StockType === 'SPECIAL ORDER' && (
        <div>
          <p className="my-2">{t('Labels_Non_Returnable')}</p>
          <Link field={data?.fields?.ReturnPolicyLink} className="underline"></Link>
        </div>
      )}
      {data && data?.data?.IsSample === true && (
        <div>
          <p className="my-2">{t('Labels_Sample')}</p>
        </div>
      )}
    </>
  );
};

export default PDPAlertMessage;
