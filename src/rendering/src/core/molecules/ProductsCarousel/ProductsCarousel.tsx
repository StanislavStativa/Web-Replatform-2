import React, { useRef } from 'react';
import { type ProductsCarouselProps } from './ProductsCarousel.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useQuery } from '@tanstack/react-query';
import ProductAPI, { UUID } from '../ProductListing/ProductAPI';
import { useRouter } from 'next/router';
import { ProductListingCard } from '../ProductListing/ProductListing.type';
import { cn } from '@/utils/cn';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { ProductList_PAYLOAD_CONTENT, PRODUCTLIST_SORT } from '@/config';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useI18n } from 'next-localization';
import { SIZE } from '@/utils/constants';
import { getPriceGroup } from '@/utils/getPriceGroup';
import Link from '@/core/atoms/Link/Link';
import { triggerEvent } from '@/utils/eventTracking';
import { event } from '@/config';
const ProductsCarousel: React.FC<ProductsCarouselProps> = (props) => {
  const { SectionTitle, DefaultItemsPerPageDesktop, DefaultItemsPerPageMobile, isMobile } =
    props?.rendering?.fields || {};
  const { t } = useI18n();
  const router = useRouter();
  const pathname = router.query.path;
  const id = pathname && pathname[pathname?.length - 1]?.split('-');
  const path = router?.asPath === '/' ? '' : id && id[id?.length - 1];
  const HoverEffect = props?.rendering?.params?.HoverEffect;
  const defaultItems = isMobile ? DefaultItemsPerPageMobile : DefaultItemsPerPageDesktop;
  const { CTAColor, CTASize } = props?.params;
  const priceGroup = getPriceGroup();
  const payload = {
    context: {
      page: { uri: router?.asPath, sku: [path] },
      store: { id: priceGroup },
      user: { uuid: UUID },
    },

    widget: { rfkid: props?.rendering?.fields?.DiscoverRfkId?.value },
    n_item: Number(defaultItems?.value),
    page_number: 1,
    sort: { value: [{ name: PRODUCTLIST_SORT, order: 'desc' }], choices: true },
    content: {
      product: {
        field: {
          value: ProductList_PAYLOAD_CONTENT,
        },
      },
    },
  };

  const { data } = useQuery({
    queryKey: ['productCarousel'],
    queryFn: () => ProductAPI({ pageParam: payload }),
    refetchOnWindowFocus: false,
  });

  const dataResult: ProductListingCard[] = data?.content?.product?.value;
  let arrows = true;
  // Check if the number of items is less than 5 and the screen width is desktop
  if (dataResult?.length <= 5 && window.innerWidth >= 1024) {
    arrows = false; // Hide arrows if fewer than 5 items on desktop
  }

  const handleClick = (productId: string, product_url: string, item: ProductListingCard) => {
    if (dataResult) {
      const pathSegments = router?.asPath
        .split('?')[0] // Remove query parameters
        .replace(/^\/+/, '') // Remove leading slashes
        .split('/'); // Split into segments
      const formattedItemListId = pathSegments?.join(' > ');
      const formattedItemListName = pathSegments?.join('-');

      const productItems = [
        {
          discount:
            Number(item?.price_purchase_retail) === 0
              ? 0
              : Number(
                  (
                    Number(item?.price_purchase_retail) - Number(item?.final_price_purchase)
                  ).toFixed(2)
                ),
          item_brand: item?.brand,
          item_category: item?.product_hierarchy1 || '',
          item_category2: item?.product_hierarchy2 || '',
          item_category3: item?.material_group || '',
          item_category4: Array.isArray(item?.collection) ? item.collection?.[0] : '', // Ensure this is always an array
          item_id: item?.sku || '',
          item_name: item?.name || '',
          price: Number(item?.final_price_purchase?.toFixed(2)),
          quantity: 1,
        },
      ];
      triggerEvent({
        event: event.SELECT_ITEM,
        ecommerce: {
          item_list_id: formattedItemListId,
          item_list_name: formattedItemListName,
          items: productItems,
        },
      });
      if (typeof window !== 'undefined' && 'rfk' in window) {
        window.rfk.push({
          value: {
            context: {
              page: {
                uri: product_url,
              },
            },
            rfkid: props?.rendering?.fields?.DiscoverRfkId?.value,
            f: '',
            click_type: 'product',
            click_text: t('CTA_Text_Shop_Now'),
            products: [
              {
                sku: productId,
              },
            ],
          },
          type: 'widget',
          name: 'click',
        });
      }
    }
  };

  const splideRef = useRef<Splide | null>(null);

  return (
    <div className="component container mx-auto md:px-10">
      {SectionTitle?.value !== '' && dataResult?.length > 0 && (
        <Text
          field={SectionTitle}
          tag={props.params.SectionHeadingTag || 'h2'}
          className={cn(
            'mt-10 mb-6 font-normal text-32 leading-10 text-center',
            getHeadingStyles(props.params.SectionHeadingSize, props.params.SectionHeadingTag)
          )}
        />
      )}
      <div className="px-12 relative">
        {dataResult && dataResult?.length > 0 && (
          <div className="carouselWrapper">
            <Splide
              ref={splideRef}
              options={{
                perPage: 5,
                perMove: 1,
                focus: 0,
                omitEnd: true,
                rewind: false,
                arrows,
                pagination: false,
              }}
              aria-label="Collection"
              className="carousel"
            >
              {dataResult.map((item, index) => {
                return (
                  <SplideSlide key={index}>
                    <Link
                      field={{ href: item?.product_url }}
                      className="cursor-pointer inline"
                      href={item?.product_url}
                      onClick={() => item?.sku && handleClick(item.sku, item?.product_url, item)}
                    >
                      <div
                        className={`${HoverEffect === '1' ? 'recommended-product-wrapper' : ''} flex flex-col mt-3 mb-6  pt-2 pb-6 mx-2 lg:mx-0 lg:px-0 items-center gap-2 rounded-lg`}
                      >
                        <img
                          src={item?.sku_image_url}
                          alt={item?.name}
                          className={cn('rounded-lg')}
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-center items-center gap-6 self-stretch text-dark-gray hover:text-black">
                          <div className="flex flex-col items-center self-stretch gap-2 py-1.5">
                            <p className="px-1 h-78 line-clamp-3 overflow-hidden text-ellipsis box-orient-vertical break-words text-center m-0 max-w-[164px] md:max-w-200 font-latoRegular">
                              {item?.name}
                            </p>
                            <p className="text-center m-0 max-w-[164px] md:max-w-200 font-latoRegular">
                              ${item?.final_price?.toFixed(2)} {item?.stock_unit}
                            </p>
                          </div>
                          <Button
                            variant={CTAColor as ButtonVariant}
                            size={CTASize as SIZE}
                            className={cn(
                              'place-self-center bg-dark-gray rounded-md border border-dark-gray font-normal  py-2 px-4 hover:font-latoBold mt-3.5'
                            )}
                          >
                            {t('CTA_Text_Shop_Now')}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </SplideSlide>
                );
              })}
            </Splide>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductsCarousel;
