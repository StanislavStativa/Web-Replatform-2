import { CategoryFieldProps, SearchProductProps } from './SearchBar.types';
import { useI18n } from 'next-localization';
import { ProductListingCard } from '../ProductListing/ProductListing.type';
import { cn } from '@/utils/cn';
import Image from '@/core/atoms/Image/Image';
import { useRouter } from 'next/router';
import { RichText } from '@sitecore-jss/sitecore-jss-nextjs';

const SearchOverlay = (props: SearchProductProps) => {
  const regex = new RegExp(props?.searchValue, 'gi');
  const { t } = useI18n();

  const headingText = (title: string) => {
    return (
      <span className="text-sm font-semibold text-search-gray tracking-wider pl-2.5 md:mb-2.5 font-latoBold">
        {title?.toUpperCase()}
      </span>
    );
  };

  const router = useRouter();

  const suggestionText = (name: string) => {
    const updatedText = name.replace(regex, (match) => `<b>${match}</b>`);
    return (
      <RichText
        field={{ value: updatedText }}
        className={cn(
          'group-hover:font-bold hover:font-bold font-normal overflow-ellipsis text-sm md:text-2xl md:leading-6 text-dark-gray text-left text-wrap'
        )}
      />
    );
  };

  const productNameText = (name: string) => {
    const updatedText = name.replace(regex, (match) => `<b>${match}</b>`);
    return <RichText field={{ value: updatedText }} />;
  };

  const handleClick = (productItem: ProductListingCard) => {
    router.push(productItem?.product_url ?? '/');
    props?.clearSearch();
  };

  return (
    <div className="md:w-718 md:mt-1.5 bg-white rounded-b-lg border-t border-tonal-gray shadow-header-overlay whitespace-normal">
      <div>
        <div className="p-6 pb-64 md:py-10 md:px-50 ">
          <div className="flex flex-wrap pl-2.5 flex-col md:flex-row">
            {props?.content?.product?.value?.length > 0 && (
              <div className="w-full md:mb-2.5">{headingText(t('Product'))}</div>
            )}
            {props?.content?.product?.value?.slice(0, 4)?.map((productItem: ProductListingCard) => {
              return (
                <button
                  onClick={() => handleClick(productItem)}
                  key={productItem?.id}
                  className="flex md:w-3/6 h-28 my-2.5 p-2.5 overflow-hidden hover:bg-tonal-gray text-shadow hover:bg-opacity-25 items-center"
                >
                  {productItem?.sku_image_url && (
                    <Image
                      className="rounded-md max-h-24 object-contain"
                      field={{
                        value: {
                          src: productItem?.sku_image_url,
                          width: 100,
                          height: 100,
                          alt: 'ProductListing',
                        },
                      }}
                    />
                  )}
                  <p
                    className={cn(
                      'inline-block pl-6 pr-5 h-20 md:py-2 overflow-hidden font-normal text-base text-dark-gray text-left text-wrap align-middle'
                    )}
                  >
                    {productNameText(productItem?.name)}
                  </p>
                </button>
              );
            })}
          </div>
          {props?.suggestion && (
            <div
              className={cn('flex  pt-5 pl-2.5 flex-col md:flex-row h-fit', {
                'justify-start':
                  !props?.suggestion?.keyphrase?.length || !props?.suggestion?.category?.length,
              })}
            >
              <div className="flex flex-1 flex-col pb-6">
                {props?.suggestion?.keyphrase?.length > 0 && headingText(t('Search_Suggestions'))}
                {props?.suggestion?.keyphrase?.map((keyphraseItem: CategoryFieldProps) => (
                  <button
                    onClick={() => {
                      router.push(
                        `${props?.resultPageLink?.value.href}?search=${keyphraseItem?.text}`
                      );
                      props?.clearSearch();
                    }}
                    key={keyphraseItem.id}
                    className="m-2.5 hover:underline "
                  >
                    {suggestionText(keyphraseItem?.text)}
                  </button>
                ))}
              </div>
              <div className="flex flex-1 flex-col pb-24 md:pb-6">
                {props?.suggestion?.category?.length > 0 && headingText(t('Categories'))}
                {props.suggestion?.category?.map((categoryItem: CategoryFieldProps) => (
                  <button
                    onClick={() => {
                      router.push(`${categoryItem.url}`);
                      props?.clearSearch();
                    }}
                    key={categoryItem.id}
                    className="hover:underline m-2.5"
                  >
                    {suggestionText(categoryItem?.text)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
