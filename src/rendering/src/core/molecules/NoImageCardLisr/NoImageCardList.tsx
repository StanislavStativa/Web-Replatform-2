import React from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type NoImageCardListProps, type NoImageCardProps } from './NoImageCardList.type';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { getStyles } from '@/utils/StyleParams';
import TextAndImageCard from '../Card/Card';
import { cn } from '@/utils/cn';

const NoImageCardList = (props: NoImageCardListProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { fields, params } = props?.rendering;

  return (
    <div
      className={`component container mx-auto ${props?.params?.styles} ${getStyles(props)}`}
      id={id ? id : undefined}
    >
      {fields?.SectionTitle && (
        <Text
          field={fields?.SectionTitle}
          tag={params?.SectionHeadingTag || 'h2'}
          className={cn(
            'mb-5 text-center font-normal mx-auto max-w-96 text-wrap text-dark-gray',
            getHeadingStyles(params?.SectionHeadingSize, params?.SectionHeadingTag),
            {
              'max-w-60 md:max-w-96': params?.IsBorder,
            }
          )}
        />
      )}

      <div
        className={cn(`grid grid-cols-1  lg:grid-cols-2 gap-10`, {
          'w-fit mx-auto': params?.IsBorder,
        })}
      >
        {fields?.Cards?.map((card: NoImageCardProps) => {
          return (
            <TextAndImageCard
              key={card.id}
              rendering={{
                fields: { ...card?.fields },
                componentName: props?.rendering?.componentName,
                params: params,
              }}
              params={params}
              isNoImage={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NoImageCardList;
