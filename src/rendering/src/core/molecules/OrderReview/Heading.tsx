import React from 'react';
import { ITypesOrderReviewHeading } from './OrderReview.type';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import { LuPrinter } from 'react-icons/lu';
import Button from '@/core/atoms/Button/Button';
import { useRouter } from 'next/router';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';

const Heading = ({
  Title,
  orderNumber,
  userEmail,
  isShowOrder,
  onPrint,
  contentToPrint,
  SecondaryCTA,
  Description,
}: ITypesOrderReviewHeading) => {
  const router = useRouter();
  const { t } = useI18n();
  const handlePrint = () => {
    onPrint(null, () => contentToPrint.current);
  };
  const descriptionHtml = Description?.value || '';
  const updatedDescription = descriptionHtml
    ?.replace('{{OrderNumber}}', orderNumber)
    ?.replace('{{UserEmail}}', userEmail);
  const content = {
    value: updatedDescription,
  };
  return (
    <div className=" w-full flex gap-6 flex-col">
      <Text
        tag={'h3'}
        className="text-28 leading-34 md:text-32 md:leading-38 font-normal"
        field={Title}
      />
      {isShowOrder && (
        <>
          <RichText className="text-base inline-block" field={content} />
          <div className="w-1/2 min-w-64 md:w-auto flex flex-col md:flex-row gap-3 md:gap-4 mt-10 md:mt-0">
            <Button onClick={handlePrint}>
              <LuPrinter className="mr-4" />
              {t('OrderReview_PrintConfirmation')}
            </Button>
            <Button
              variant={ButtonVariant.OUTLINE}
              onClick={() => router.replace(SecondaryCTA?.value?.href)}
            >
              {SecondaryCTA?.value?.title}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Heading;
