import React, { useMemo } from 'react';
import Link from '@/core/atoms/Link/Link';
import { RichText } from '@sitecore-jss/sitecore-jss-react';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import { type IFieldProps } from './CategoryCardswithEmbedLinks.type';
import { cn } from '@/utils/cn';

interface IFieldPropsExtended extends IFieldProps {
  opacity: string;
  expanded: boolean;
}

const CategoryCardOverlay = (props: IFieldPropsExtended): JSX.Element => {
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;
  const { Description, Links, opacity, expanded } = props;

  const className = useMemo(() => {
    if (isMobile) {
      return `${expanded ? 'ease-in-out max-h-[1000px] py-10' : 'ease-in-out max-h-0  py-0'} md:hidden transtion-all duration-500 overflow-hidden bg-black text-white text-lg px-8 top-0 left-0 w-full relative z-20`;
    }
    return `hidden md:block h-full w-full overflow-hidden hover:overflow-y-auto transition-all duration-700 ease-in-out md:flex text-lg py-10 px-2.5 absolute min-h-full bg-black text-white opacity-0 hover:opacity-${opacity || '75'}`;
  }, [isMobile, expanded, opacity]);

  return (
    <div className={className}>
      <RichText
        field={Description}
        className={cn(
          'px-5 w-full pt-0 md:pt-10 md:px-16 mb-4 md:mb-0 md:overflow-y-auto',
          Links?.length > 0 ? 'md:w-[65%]' : 'md:w-full'
        )}
      />
      {Links?.length > 0 && (
        <ul
          className={cn(
            'px-5 md:px-9 md:text-sm md:pt-5 md:text-white md:min-h-full md:h-fit',
            Description?.value !== ''
              ? 'md:w-[35%] md:border-white md:border-solid md:border-l'
              : 'md:w-full'
          )}
        >
          {Links?.map((link) => (
            <li key={link.id} className="mb-3">
              <Link
                field={link?.fields?.CTA}
                className="text-white block pointer-events-auto no-underline text-sm uppercase w-auto"
              >
                <span className="hover:underline font-latoBold">
                  {link?.fields?.CTA?.value?.text}
                </span>
                <span className="pl-1.5 hover:no-underline">{`>`}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryCardOverlay;
