import React, { useEffect, useState } from 'react';
import Image from '@/core/atoms/Image/Image';
import { Image as UnpicImage } from '@unpic/react/nextjs';
import { cn } from '@/utils/cn';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useRouter } from 'next/navigation';
import { useRouter as useNavigation } from 'next/router';

import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import SampleCartSvg from '@/core/atoms/Icons/SampleCartSvg';
import { ProductListingCard } from './ProductListing.type';
import { useDeviceType, DeviceType } from '@/hooks/useDeviceType';
import { useAtom } from 'jotai';
import {
  confirmationClickType,
  confirmationModelDescription,
  confirmationModelTitle,
  confirmationSampleWarning,
  itemConfirmationModal,
  modalOpen,
} from '../Modal/atom';
import { cartDetailAtom, stopDataSync } from '@/core/cartStore/cartState';
import ItemConfirmation from '../Modal/ItemConfirmation';
import useCart from '@/hooks/useCart';
import Cookies from 'js-cookie';
import { IS_PROUSER } from '@/config';
import { ClickType } from '../Modal/modal.type';
import Confirmation from '../Modal/Confirmation';
// import Link from '@/core/atoms/Link/Link';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { authorizationAtom } from '@/data/atoms/authorization';
import { triggerEvent } from '@/utils/eventTracking';
import { event } from '@/config';
import useLocalStorage from '@/utils/useLocalStorage';
import { BTNFUNCTION } from '@/utils/constants';

const ProductListingCards: React.FC<ProductListingCard> = (props) => {
  const {
    sku_image_url,
    price,
    final_price,
    sample_price,
    sample_sku_pro,
    sample_sku_retail,
    name,
    stock_unit,
    inspiration_image_url,
    is_clearance,
    is_featured,
    is_new_arrival,
    rankby1,
    product_url,
    sku,
    isProductDetails,
    discoverRfkId,
    final_price_purchase,
    btnText,
    btnFunctionality,
    isExtendedStyle = false,
  } = props;

  const isProUser = Cookies.get(IS_PROUSER);
  const { t } = useI18n();
  const router = useRouter();
  const navigation = useNavigation();
  const isDesktop: boolean = useDeviceType() === DeviceType.Desktop;
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;
  const isTablet: boolean = useDeviceType() === DeviceType.Tablet;
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  // Modal
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpen);
  const [, setSampleWarning] = useAtom(confirmationSampleWarning);
  const [, setTitle] = useAtom(confirmationModelTitle);
  const [, setDescription] = useAtom(confirmationModelDescription);
  const [, setClickType] = useAtom(confirmationClickType);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isItemConfirmationModalOpen] = useAtom(itemConfirmationModal);
  const isSampleButton = isProUser ? sample_sku_pro : sample_sku_retail;

  const [, setIsDisabled] = useState<boolean>(false);
  const { addToCart, getLocalNumberOfSamples, isProductInCart, isProductInLocalCart } = useCart();
  const [, setStopDataSync] = useAtom(stopDataSync);
  const { setSessionData } = useLocalStorage();

  const handleViewItem = () => {
    setSessionData('isBreadCrumbsFromApi', false);
    const pathSegments = navigation?.asPath
      .split('?')[0] // Remove query parameters
      .replace(/^\/+/, '') // Remove leading slashes
      .split('/'); // Split into segments
    const formattedItemListId = pathSegments?.join(' > ');
    const formattedItemListName = pathSegments?.join('-');

    const productItems = [
      {
        discount:
          Number(props?.price_purchase_retail) === 0
            ? 0
            : Number(
                (
                  Number(props?.price_purchase_retail) - Number(props?.final_price_purchase)
                ).toFixed(2)
              ),
        item_brand: props?.brand,
        item_category: props?.product_hierarchy1 || '',
        item_category2: props?.product_hierarchy2 || '',
        item_category3: props?.material_group || '',
        item_category4: Array.isArray(props?.collection) ? props.collection?.[0] : '', // Ensure this is always an array
        item_id: props?.sku || '',
        item_name: props?.name || '',
        price: Number(final_price_purchase?.toFixed(2)),
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
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    const localSamples = getLocalNumberOfSamples();
    const isInLocalCart = isProductInLocalCart(sku ?? '');
    const isInCart = isProductInCart(sku ?? '');
    const productItems = {
      discount: isProUser ? Number(sample_price?.toFixed(2)) : 0,
      item_brand: props?.brand,
      item_category: 'Sample',
      item_category2: props?.product_hierarchy2 || '',
      item_category3: props?.material_group || '',
      item_category4: Array.isArray(props?.collection) ? props.collection?.[0] : '', // Ensure this is always an array
      item_id: isSampleButton || '',
      item_name: '',
      price: Number(sample_price?.toFixed(2)),
      quantity: 1,
    };
    if (isInLocalCart || isInCart) {
      setIsDisabled(true);
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
        sku: sku ?? '',
        sku_image_url,
      });
      triggerEvent({
        event: event?.ADD_TO_CART,
        ecommerce: {
          currency: 'USD',
          value: isProUser ? 0 : Number(sample_price?.toFixed(2)),
          items: [productItems],
        },
      });

      setIsDisabled(true);
    }
  };
  const isHoverImage: boolean | undefined = inspiration_image_url?.includes('https://');

  const getProductTags = () => {
    if (is_clearance) {
      return t('Tag_Clearance');
    } else if (rankby1 && rankby1 > 0) {
      return t('Tag_BestSeller');
    } else if (is_featured) {
      return t('Tag_Featured');
    } else if (is_new_arrival) {
      return t('Tag_NewArrival');
    }
    return '';
  };

  const getDiscountPrec = () => {
    if (final_price && price !== final_price) {
      return (((price - final_price) / price) * 100)?.toFixed(0);
    }
    return '';
  };

  const getProductTitle = () => {
    if (isDesktop) {
      return name?.length > 100 ? `${name.substring(0, name.lastIndexOf(' ', 97))} ...` : name;
    } else if (isTablet) {
      return name?.length > 45 ? `${name.substring(0, name.lastIndexOf(' ', 43))} ...` : name;
    } else {
      return name?.length > 60 ? `${name.substring(0, name.lastIndexOf(' ', 56))} ...` : name;
    }
  };

  const productTags = getProductTags();
  const discountPrec = getDiscountPrec();
  const productTitle = getProductTitle();

  const checkItemPresent = () => {
    const itemPresent = props.cartItem.find(
      (item) =>
        item?.isSample === true &&
        item?.productId?.replace(/SS/g, '') === isSampleButton?.replace(/SS/g, '')
    );
    return itemPresent;
  };

  const getButtonContent = () => {
    let buttonChild: JSX.Element;
    if (isProUser) {
      buttonChild = sample_sku_pro ? (
        <>
          <span className="md:h-6 hidden lg:block ">
            <SampleCartSvg isDisabled={checkItemPresent() ? true : false} />
          </span>
          {checkItemPresent()
            ? t('Tag_SampleInCart')
            : btnFunctionality === BTNFUNCTION?.ADDSAMPLE
              ? btnText
              : t('Tag_AddSample')}
        </>
      ) : (
        <></>
      );
    } else {
      buttonChild = sample_sku_retail ? (
        <>
          <span className="md:h-6 hidden lg:block ">
            <SampleCartSvg isDisabled={checkItemPresent() ? true : false} />
          </span>
          {checkItemPresent()
            ? t('Tag_SampleInCart')
            : btnFunctionality === BTNFUNCTION?.ADDSAMPLE
              ? btnText
              : t('Tag_AddSample')}
          {!checkItemPresent() &&
            sample_price !== undefined &&
            sample_price > 0 &&
            `- $${sample_price} `}
        </>
      ) : (
        <></>
      );
    }
    return buttonChild;
  };

  const isHoverableCardStyles =
    'border-0 border-transparent hover:scale-106 hover:shadow-custom hover:p-3 hover:font-latoBold transition-all duration-60 ease-out hover:rounded-xl border-2 border-transparent hover:border-dark-gray hover:border-opacity-10';

  useEffect(() => {
    if (isAuthenticated && cartDetailState) {
      const isItemPresent = cartDetailState?.Samples?.CartItem?.find(
        (item) => item?.ProductId?.replace(/SS/g, '') === isSampleButton?.replace(/SS/g, '')
      );

      if (isItemPresent && isItemPresent !== undefined) {
        setIsDisabled(true);
      }
    }
  }, [cartDetailState, isAuthenticated, isSampleButton]);
  useEffect(() => {
    setStopDataSync(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductClick = (product_url: string) => {
    if (typeof window !== 'undefined' && 'rfk' in window) {
      window.rfk.push({
        value: {
          context: {
            page: {
              uri: product_url,
            },
          },
          rfkid: discoverRfkId,
          f: '',
          click_type: 'product',
          products: [
            {
              sku: sku ? sku : '',
            },
          ],
        },
        type: 'widget',
        name: 'click',
      });
    }
  };

  return (
    <>
      <button
        className={cn(
          'flex flex-col gap-3 group md:p-3 h-fit',
          !isMobile && !isTablet && isHoverableCardStyles,
          {
            'md:px-2 md:pt-2 md:pb-6 md:mt-3 md:hover:px-2 md:hover:pt-2 md:hover:shadow-detailPageShadow md:h-auto':
              isProductDetails,
          }
        )}
        onClick={handleViewItem}
      >
        <div
          className={cn(
            `relative w-full ${isExtendedStyle ? 'md:max-h-64' : 'h-[45vw] max-h-64 md:h-[18vw]'} lg:flex flex items-center`,
            {
              'w-152 h-152 md:h-200 md:w-200 ': isProductDetails,
            }
          )}
        >
          {sku_image_url && (
            <a
              href={product_url ?? ''}
              // field={{ value: { href: product_url ?? '' } }}
              className="relative h-full flex items-center justify-center w-auto rounded-0 hover:drop-shadow-none transition-none duration-0 ease-in-out hover:font-normal lg:max-h-64"
              // prefetch={false}
            >
              <Image
                alt="ProductListing"
                desktopSrc={sku_image_url}
                className={cn('object-contain md:max-h-272 lg:max-h-64', {
                  'visible group-hover:invisible': isHoverImage,
                })}
              />

              {isHoverImage && inspiration_image_url && (
                <div className="absolute inset-0">
                  <UnpicImage
                    alt="ProductListing"
                    src={inspiration_image_url}
                    layout="constrained"
                    className="object-cover md:max-h-272 invisible group-hover:visible"
                  />
                </div>
              )}
            </a>
          )}
          {productTags && (
            <div className="absolute bottom-4 w-full flex items-center justify-center lg:bottom-8 xl:bottom:4 ">
              <div
                className={cn(
                  'w-fit text-black text-xs font-latoBold text-nowrap px-3 py-1 rounded-xl bg-tonal-gray',
                  {
                    'bg-dark-red text-white ': is_clearance,
                    'bg-black-olive text-white ': is_new_arrival,
                  }
                )}
              >
                {productTags}
              </div>
            </div>
          )}
        </div>
        {name && (
          <button
            onClick={() => {
              router.replace(props?.product_url);
              handleProductClick(props?.product_url);
            }}
            className={cn('w-fit')}
          >
            <p
              className={cn(
                'group-hover:font-latoBold font-normal h-12 md:h-69 overflow-hidden text-xs xsm:text-base md:leading-6 text-dark-gray text-left text-wrap',
                {
                  'text-center text-base hover:font-latoBold h-20 pb-2.5 md:w-200 w-152':
                    isProductDetails,
                }
              )}
            >
              {productTitle}
            </p>
          </button>
        )}
        <div className="flex flex-col w-full">
          <>
            {price && (
              <div
                className={cn(
                  'font-latoSemiBold text-xs md:text-sm neutral-900 mr-1.5 hover:font-latoBold text-left',
                  {
                    'line-through': parseInt(discountPrec) > 0,
                  },
                  {
                    'text-center font-normal md:text-base text-dark-gray leading-6 mr-0 md:w-200 w-152 text-base':
                      isProductDetails,
                  }
                )}
              >
                ${price?.toFixed(2)}
                {stock_unit}
              </div>
            )}
            {parseInt(discountPrec) > 0 && !props?.is_clearance && (
              <span className="text-left">
                ${final_price?.toFixed(2)}
                {stock_unit}
              </span>
            )}
          </>
          {parseInt(discountPrec) > 0 && props?.is_clearance && (
            <div className="flex justify-between text-xs lg:text-base font-latoBold md:leading-6 text-dark-red ">
              <span>
                ${final_price?.toFixed(2)}
                {stock_unit}
              </span>
              {`${discountPrec}% OFF`}
            </div>
          )}
        </div>
        {btnFunctionality === BTNFUNCTION?.SHOPNOW && (
          <Button
            variant={ButtonVariant.BLACK}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              handleViewItem();
              router.push(product_url ?? '');
            }}
            className={cn(
              'w-full place-self-center bg-dark-gray rounded-md border border-dark-gray font-normal text-xs leading-4 py-2 px-4 hover:font-latoBold mt-3.5',
              {
                'w-full': isExtendedStyle,
              }
            )}
          >
            {btnText}
          </Button>
        )}

        {isProductDetails && btnFunctionality !== BTNFUNCTION?.SHOPNOW ? (
          <Button
            variant={ButtonVariant.BLACK}
            className={cn(
              {
                'w-full place-self-center bg-dark-gray rounded-md border border-dark-gray font-normal text-xs leading-4 py-2 px-4 hover:font-latoBold mt-3.5':
                  isProductDetails,
              },
              {
                'w-full': isExtendedStyle,
              }
            )}
          >
            {t('CTA_Text_Shop_Now')}
          </Button>
        ) : (
          isSampleButton &&
          btnFunctionality !== BTNFUNCTION?.SHOPNOW && (
            <Button
              className={cn(
                'w-full mt-2.5 text-center rounded-md text-sm xsm:text-sm md:text-xs lg:text-sm font-medium md:leading-4 md:py-4 md:px-2 md:gap-1.5 gap-2.5 h-10 px-0 hover:font-latoBold hover:shadow-button hover:drop-shadow-none',
                {
                  'bg-white-smoke border-zinc-600 border-opacity-65 hover:border-zinc-600 hover:border-opacity-65 text-olive-gray hover:text-olive-gray  hover:font-normal hover:shadow-none':
                    checkItemPresent(),
                },
                {
                  'w-full': isExtendedStyle,
                }
              )}
              variant={ButtonVariant.OUTLINE}
              onClick={(e) => handleClick(e)}
              disabled={checkItemPresent() ? true : false}
            >
              {getButtonContent()}
            </Button>
          )
        )}
      </button>
      {isItemConfirmationModalOpen ? <ItemConfirmation /> : null}
      {isModalOpen ? <Confirmation /> : null}
    </>
  );
};

export default ProductListingCards;
