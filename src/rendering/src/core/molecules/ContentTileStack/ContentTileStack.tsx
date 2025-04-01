import React from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import ContentTile from '../ContentTile/ContentTile';
import { type ContentTileStackProps, type ItemList } from './ContentTileStack.type';
import { cn } from '@/utils/cn';
import { THEME } from '@/utils/constants';

const ContentTileStack = (props: ContentTileStackProps) => {
  const { fields, params } = props?.rendering;
  const id = props?.params?.RenderingIdentifier;
  const IsImageOnRightCheck = (index: number) => {
    const myParams = { ...params };
    if (params.IsImageOnRight) {
      index % 2 !== 0 ? delete myParams['IsImageOnRight'] : (myParams.IsImageOnRight = '1');
    } else {
      index % 2 !== 0 ? (myParams.IsImageOnRight = '1') : delete myParams['IsImageOnRight'];
    }
    return myParams;
  };

  return (
    <div
      className={`component py-40 text-center  ${props?.params?.styles}`}
      id={id ? id : undefined}
    >
      <Text
        field={fields?.SectionTitle}
        tag={params?.SectionHeadingTag || 'h2'}
        className="mb-20"
      />
      <div className="py-10 ">
        {fields?.ItemList?.map((item: ItemList, index: number) => {
          return (
            <div
              key={item.id}
              className={cn(
                'block md:px-4',
                {
                  'md:pt-10': index === 0,
                  'md:border-b-8 border-white': index === fields.ItemList.length - 1,
                },
                {
                  'bg-slate-white-400': params.BackgroundColor === THEME.LIGHT,
                  'bg-dark-gray': params.BackgroundColor === THEME.DARK,
                }
              )}
            >
              <ContentTile
                rendering={{
                  fields: { ...item?.fields },
                  componentName: props?.rendering?.componentName,
                  params: params,
                }}
                params={IsImageOnRightCheck(index)}
                className={cn('pt-4 px-0 md:p-0', {
                  '-mt-20': index === 0,
                  '-mb-20': index === fields?.ItemList?.length - 1,
                })}
                isStack={true}
                TitleHeadingSize={props?.params?.HeadingSize}
                buttonStyle="hover:font-normal hover:filter-none no-underline hover:underline"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ContentTileStack;
