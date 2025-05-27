import React, { useRef } from 'react';
import { type ProductsCarouselProps } from './ProductsCarousel.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useQuery } from '@tanstack/react-query';
import ProductAPI, { UUID } from '../ProductListing/ProductAPI';
import { useRouter } from 'next/router';
import { ProductListingCard } from '../ProductListing/ProductListing.type';
import { cn } from '@/utils/cn';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { IS_PROUSER, ProductList_PAYLOAD_CONTENT, PRODUCTLIST_SORT } from '@/config';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useI18n } from 'next-localization';
import { getPriceGroup } from '@/utils/getPriceGroup';
import { triggerEvent } from '@/utils/eventTracking';
import { event } from '@/config';
import useLocalStorage from '@/utils/useLocalStorage';
import { BTNFUNCTION } from '@/utils/constants';
import Cookies from 'js-cookie';
import { useAtom } from 'jotai';
import cartAtom from '@/core/cartStore/cartState';
import useCart from '@/hooks/useCart';
import {
  confirmationClickType,
  confirmationModelDescription,
  confirmationModelTitle,
  confirmationSampleWarning,
  itemConfirmationModal,
  modalOpen,
} from '../Modal/atom';
import { ClickType } from '../Modal/modal.type';
import ItemConfirmation from '../Modal/ItemConfirmation';
import Confirmation from '../Modal/Confirmation';

const ProductsCarousel: React.FC<ProductsCarouselProps> = (props) => {
  const isProUser = Cookies.get(IS_PROUSER);

  const {
    SectionTitle,
    DefaultItemsPerPageDesktop,
    DefaultItemsPerPageMobile,
    isMobile,
    ButtonFunctionality,
    ButtonText,
  } = props?.rendering?.fields || {};
  const { t } = useI18n();
  const router = useRouter();
  const pathname = router.query.path;
  const { setSessionData } = useLocalStorage();
  const [localCart] = useAtom(cartAtom);
  const id = pathname && pathname[pathname?.length - 1]?.split('-');
  const path = router?.asPath === '/' ? '' : id && id[id?.length - 1];
  const HoverEffect = props?.rendering?.params?.HoverEffect;
  const defaultItems = isMobile ? DefaultItemsPerPageMobile : DefaultItemsPerPageDesktop;
  // const { CTAColor, CTASize } = props?.params;
  const { addToCart, getLocalNumberOfSamples, isProductInCart, isProductInLocalCart } = useCart();
  // Modal
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpen);
  const [, setSampleWarning] = useAtom(confirmationSampleWarning);
  const [, setTitle] = useAtom(confirmationModelTitle);
  const [, setDescription] = useAtom(confirmationModelDescription);
  const [, setClickType] = useAtom(confirmationClickType);
  const [isItemConfirmationModalOpen] = useAtom(itemConfirmationModal);
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

  const checkItemPresent = (isSampleButton: string | undefined) => {
    const itemPresent = localCart?.find(
      (item) =>
        item?.isSample === true &&
        item?.productId?.replace(/SS/g, '') === isSampleButton?.replace(/SS/g, '')
    );
    return itemPresent;
  };

  const getButtonContent = (isSampleButton: string | undefined, item: ProductListingCard) => {
    let buttonChild: JSX.Element;
    if (isProUser) {
      buttonChild = item?.sample_sku_pro ? (
        <>
          {checkItemPresent(isSampleButton)
            ? t('Tag_SampleInCart')
            : ButtonFunctionality?.value === BTNFUNCTION?.ADDSAMPLE
              ? ButtonText?.value
              : t('Tag_AddSample')}
        </>
      ) : (
        <></>
      );
    } else {
      buttonChild = item?.sample_sku_retail ? (
        <>
          {checkItemPresent(isSampleButton)
            ? t('Tag_SampleInCart')
            : ButtonFunctionality?.value === BTNFUNCTION?.ADDSAMPLE
              ? ButtonText?.value
              : t('Tag_AddSample')}
          {!checkItemPresent(isSampleButton) &&
            item?.sample_price !== undefined &&
            item?.sample_price > 0 &&
            `- $${item?.sample_price} `}
        </>
      ) : (
        <></>
      );
    }
    return buttonChild;
  };
  const handleClick = (productId: string, product_url: string, item: ProductListingCard) => {
    setSessionData('isBreadCrumbsFromApi', true);
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
        window?.rfk?.push({
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
    router.push(product_url);
  };

  const handleBtnAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ProductListingCard,
    isSampleButton: string | undefined
  ) => {
    e.stopPropagation();
    const localSamples = getLocalNumberOfSamples();
    const isInLocalCart = isProductInLocalCart(item?.sku ?? '');
    const isInCart = isProductInCart(item?.sku ?? '');
    const productItems = {
      discount: isProUser ? Number(item?.sample_price?.toFixed(2)) : 0,
      item_brand: item?.brand,
      item_category: 'Sample',
      item_category2: item?.product_hierarchy2 || '',
      item_category3: item?.material_group || '',
      item_category4: Array.isArray(item?.collection) ? item.collection?.[0] : '', // Ensure this is always an array
      item_id: isSampleButton || '',
      item_name: '',
      price: Number(item?.sample_price?.toFixed(2)),
      quantity: 1,
    };
    if (isInLocalCart || isInCart) {
      return;
    }
    if (localSamples >= 15) {
      // Trigger Popup
      setTitle(t('PDPAttributes_SampleLimitTitle'));
      setDescription(t('PDPAttributes_SampleLimitText'));
      setClickType(ClickType.Cart);
      setSampleWarning(true);
      setIsModalOpen(true);
    } else {
      addToCart({
        productId: isSampleButton ?? '',
        quantity: '1',
        isSample: true,
        sku: item?.sku ?? '',
        sku_image_url: item?.sku_image_url,
      });
      triggerEvent({
        event: event?.ADD_TO_CART,
        ecommerce: {
          currency: 'USD',
          value: isProUser ? 0 : Number(item?.sample_price?.toFixed(2)),
          items: [productItems],
        },
      });
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
                const isSampleButton = isProUser ? item?.sample_sku_pro : item?.sample_sku_retail;
                return (
                  <SplideSlide key={index}>
                    <article
                      className="cursor-pointer inline"
                      onClick={() => item?.sku && handleClick(item.sku, item?.product_url, item)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${item?.name}`}
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
                          {ButtonFunctionality?.value === BTNFUNCTION?.SHOPNOW ? (
                            <Button
                              variant={ButtonVariant.BLACK}
                              className={cn(
                                'place-self-center bg-dark-gray rounded-md border border-dark-gray font-normal text-xs leading-4 py-2 px-4 hover:font-latoBold mt-3.5'
                              )}
                            >
                              {ButtonText?.value !== ''
                                ? ButtonText?.value
                                : t('CTA_Text_Shop_Now')}
                            </Button>
                          ) : (
                            isSampleButton &&
                            ButtonFunctionality?.value === BTNFUNCTION?.ADDSAMPLE && (
                              <Button
                                className={cn(
                                  'mt-2.5 text-center rounded-md text-sm xsm:text-sm md:text-xs lg:text-sm font-medium md:leading-4 md:py-4 md:px-2 md:gap-1.5 gap-2.5 h-10 px-0 hover:font-latoBold hover:shadow-button hover:drop-shadow-none',
                                  {
                                    'px-1 bg-white-smoke border-zinc-600 border-opacity-65 hover:border-zinc-600 hover:border-opacity-65 text-olive-gray hover:text-olive-gray  hover:font-normal hover:shadow-none':
                                      checkItemPresent(isSampleButton),
                                  }
                                )}
                                variant={ButtonVariant.OUTLINE}
                                onClick={(e) => handleBtnAction(e, item, isSampleButton)}
                                disabled={checkItemPresent(isSampleButton) ? true : false}
                              >
                                {getButtonContent(isSampleButton, item)}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </article>
                  </SplideSlide>
                );
              })}
            </Splide>
          </div>
        )}
      </div>
      {isItemConfirmationModalOpen ? <ItemConfirmation /> : null}
      {isModalOpen ? <Confirmation /> : null}
    </div>
  );
};
export default ProductsCarousel;
