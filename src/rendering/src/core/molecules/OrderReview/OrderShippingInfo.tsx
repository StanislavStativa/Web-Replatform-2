import React, { memo } from 'react';
import { useI18n } from 'next-localization';
import { ITypeITypesOrderShippingInfo, ITypeShipAddress } from './OrderReview.type';
import { cn } from '@/utils/cn';
const OrderShippingInfo = ({ shipAddress }: ITypeITypesOrderShippingInfo) => {
  const { t } = useI18n();
  return (
    <section className="flex flex-col gap-6 py-6 px-3.7 lg:px-10 border border-gray rounded-xl mb-6">
      <h4 className="text-2xl font-normal">{t('OrderReview_ShippingInfo')}</h4>
      <div className="flex flex-col gap-0  md:flex-row">
        {shipAddress?.map((item: ITypeShipAddress, index: number) => {
          if (item && item?.IsItemAddress && item?.IsPickUpStoreAddress) {
            return (
              <div
                key={index}
                className={cn({
                  'md:border-l md:border-dark-gray md:ml-30 md:pl-7 md:border-opacity-30':
                    index === 1,
                })}
              >
                {index === 1 && (
                  <hr className=" md:hidden border-t border-dark-gray w-full opacity-30 mt-4 mb-4" />
                )}
                <p className="text-base font-latoBold mb-3">
                  {t('OrderReview_ItemsShippingToStore')}
                </p>
                <p className="text-base font-normal max-w-40">
                  {t('label_tts')} {item?.AddressName}
                  <br />
                  {item?.Street1}
                  <br />
                  {item?.City}, {item?.State} {item?.Zip}
                </p>
              </div>
            );
          } else if (item && item?.IsSampleAddress && item?.IsItemAddress) {
            return (
              <div
                key={index}
                className={cn({
                  'md:border-l md:border-dark-gray md:ml-30 md:pl-7 md:border-opacity-30':
                    index === 1,
                })}
              >
                {index === 1 && (
                  <hr className=" md:hidden border-t border-dark-gray w-full opacity-30 mt-4 mb-4" />
                )}
                <p className="text-base font-latoBold mb-3">
                  {t('OrderReview_ItemAndSamplesSentTo')}
                </p>
                <p className="text-base font-normal max-w-40">
                  {item?.CompanyName}
                  <br />
                  {item?.Street1}
                  {item?.Street2 && (
                    <>
                      <br />
                      {item?.Street2}
                    </>
                  )}
                  <br />
                  {item?.City}, {item?.State} {item?.Zip}
                </p>
              </div>
            );
          } else if (item && item?.IsItemAddress) {
            return (
              <div
                key={index}
                className={cn({
                  'md:border-l md:border-dark-gray md:ml-30 md:pl-7 md:border-opacity-30':
                    index === 1,
                })}
              >
                {index === 1 && (
                  <hr className=" md:hidden border-t border-dark-gray w-full opacity-30 mt-4 mb-4" />
                )}
                <p className="text-base font-latoBold mb-3">{t('OrderReview_ItemSentTo')}</p>
                <p className="text-base font-normal max-w-40">
                  {item?.CompanyName}
                  <br />
                  {item?.Street1}
                  {item?.Street2 && (
                    <>
                      <br />
                      {item?.Street2}
                    </>
                  )}
                  <br />
                  {item?.City}, {item?.State} {item?.Zip}
                </p>
              </div>
            );
          } else if (item && item?.IsSampleAddress) {
            return (
              <div
                key={index}
                className={cn({
                  'md:border-l md:border-dark-gray md:ml-30 md:pl-7 md:border-opacity-30':
                    index === 1,
                })}
              >
                {index === 1 && (
                  <hr className=" md:hidden border-t border-dark-gray w-full opacity-30 mt-4 mb-4" />
                )}
                <p className="text-base font-latoBold mb-3">{t('OrderReview_SamplesSentTo')}</p>
                <p className="text-base font-normal max-w-40">
                  {item?.CompanyName}
                  <br />
                  {item?.Street1}
                  {item?.Street2 && (
                    <>
                      <br />
                      {item?.Street2}
                    </>
                  )}
                  <br />
                  {item?.City}, {item?.State} {item?.Zip}
                </p>
              </div>
            );
          } else {
            return <></>;
          }
        })}
      </div>
    </section>
  );
};

export default memo(OrderShippingInfo);
