import React from 'react';
import { IoDocumentOutline } from 'react-icons/io5';
import { cn } from '@/utils/cn';
import {
  type Documents,
  type PDPInfo_DimensionsArrayKeyValue,
  type SpecificationsSectionProps,
} from '../PDPInfo.types';
import { useI18n } from 'next-localization';

const isDoc = (item: PDPInfo_DimensionsArrayKeyValue | Documents): item is Documents => {
  return (item as Documents).Url !== undefined;
};

const SpecificationGrid: React.FC<SpecificationsSectionProps> = ({
  data,
  title,
  isDocument = false,
}) => {
  const { t } = useI18n();
  return (
    <div className="w-full">
      {title && <p className="font-latoBold text-lg mb-6">{title}</p>}
      <div className="grid grid-flow-row gap-x-6 w-full">
        {data?.map((item, index: number) => (
          <div
            key={index}
            className={cn(
              'flex justify-between flex-wrap px-1.5 py-3 border-b border-light-gray',
              index % 2 === 0 ? 'bg-zinc-50' : ''
            )}
          >
            <div className="text-dark-gray font-latoBold text-base leading-6">{t(item.Key)}</div>
            {isDocument && isDoc(item) ? (
              <div className="flex items-center">
                <IoDocumentOutline className="mr-2" />
                <a href={item?.Url} target="_blank" className="underline cursor-pointer">
                  <div className="max-w-64 text-right">
                    {item?.Name} &nbsp;({t('PDF')})
                  </div>
                </a>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-end text-right">
                  <div className="max-w-64 text-right">
                    {(item as PDPInfo_DimensionsArrayKeyValue)?.Value}
                  </div>
                </div>
                <p className="basis-full mt-[5px] text-left text-sm italic">
                  {item?.Key === 'PDPInfo_Applications' ? t('PDPInfo_application_callout') : ''}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificationGrid;
