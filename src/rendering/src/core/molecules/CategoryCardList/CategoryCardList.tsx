import React from 'react';
import { type CategoryCardListFieldProps, type CategoryCardListProps } from './CategoryCard.types';
import CategoryCard from './CategoryCard';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { getStyles } from '@/utils/StyleParams';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';
const CategoryCardList: React.FC<CategoryCardListProps> = (props) => {
  const { fields } = props?.rendering;

  const {
    HeadingTag,
    Layout,
    CTAHoverEffect,
    HeadingSize,
    IsComponentClickable,
    IsPinterestEnable,
  } = props?.params;

  const getGridCols = (size: string) => {
    switch (size) {
      case 'Large':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'Medium':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      default:
        return `grid-cols-2 ${fields?.CardList?.length > 5 ? 'sm:grid-cols-6' : 'sm:flex sm:flex-wrap'}`;
    }
  };

  return (
    <div className={`container mx-auto px-5 md:px-10 ${getStyles(props)}`}>
      {(fields?.Title?.value?.length ?? 0) > 0 && (
        <Text
          field={fields?.Title}
          tag={HeadingTag}
          className={cn(
            'break-all text-center mb-10 font-normal',
            getHeadingStyles(HeadingSize, HeadingTag)
          )}
        />
      )}
      <div className={`grid ${getGridCols(Layout)} items-start gap-4 xl:gap-8`}>
        {fields?.CardList?.map((data: CategoryCardListFieldProps) => {
          return (
            <CategoryCard
              key={data?.id}
              fields={data?.fields}
              Layout={Layout}
              HeadingTag={HeadingTag}
              HeadingSize={HeadingSize}
              CTAHoverEffect={CTAHoverEffect}
              isClickable={IsComponentClickable}
              IsPinterestShow={IsPinterestEnable}
              ImageClass="sm:w-20 sm:h-20 md:w-24 md:h-24"
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCardList;
