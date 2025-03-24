import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { useAtom } from 'jotai';
import { productStore } from '@/data/atoms/productStore';
interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ComponentProps): JSX.Element => {
  const [formState] = useAtom(productStore);
  const styles = `${props?.params?.GridParameters ?? ''} ${props?.params?.styles ?? ''}`.trimEnd();

  const columnWidths = [
    props.params.ColumnWidth1,
    props.params.ColumnWidth2,
    props.params.ColumnWidth3,
    props.params.ColumnWidth4,
    props.params.ColumnWidth5,
    props.params.ColumnWidth6,
    props.params.ColumnWidth7,
    props.params.ColumnWidth8,
  ];
  const columnStyles = [
    props.params.Styles1,
    props.params.Styles2,
    props.params.Styles3,
    props.params.Styles4,
    props.params.Styles5,
    props.params.Styles6,
    props.params.Styles7,
    props.params.Styles8,
  ];
  const enabledPlaceholders = props?.params?.EnabledPlaceholders?.split(',');
  const id = props?.params?.RenderingIdentifier;
  const stickyDiv =
    props?.params?.ProductImageGalleryColumnSplitter && formState?.isModal === false
      ? 'lg:mt-10'
      : '';
  const gapY = props?.params?.ProductImageGalleryColumnSplitter ? 'md:gap-y-10' : 'gap-y-10';
  const backGroundClr = props?.params?.BackgroundColor;
  return (
    <div
      className={cn(
        `grid ${gapY} md:gap-10 grid-cols-12 mx-auto column-splitter-custom ${backGroundClr === 'Dark' ? 'bg-dark-gray py-10 px-6 lg:flex md:py-16 md:px-20 justify-center items-start text-center mb-0 md:mb-10 lg:pdp-footer mx-6 md:mx-10 lg:mx-20' : 'container'} ${props?.params?.OC_Column_Splitter ? '' : props?.params?.Styles?.includes('no-padding') ? '' : 'px-5 md:px-10'} ${styles}`
      )}
      id={id}
    >
      {enabledPlaceholders.map((ph, index) => {
        const phKey = `column-${ph}-{*}`;
        const phStyles = `${columnWidths[+ph - 1]} ${columnStyles[+ph - 1] ?? ''}`.trimEnd();
        const key = `${index}-column-splitter`;

        return (
          <div
            key={key}
            className={cn('flex', `${backGroundClr === 'Dark' ? 'lg:px-3' : 'w-full'}`, phStyles)}
          >
            <div
              className={cn(
                `${props?.params?.OC_Column_Splitter ? '' : 'flex'} flex-col ${stickyDiv} ${backGroundClr === 'Dark' ? 'lg:max-w-[300px]' : 'w-full'}`
              )}
            >
              <Placeholder name={phKey} rendering={props.rendering} />
            </div>
            {props?.params?.AddSeparator && (
              <hr className="w-px h-full bg-tonal-gray hidden md:block" />
            )}
          </div>
        );
      })}
    </div>
  );
};
