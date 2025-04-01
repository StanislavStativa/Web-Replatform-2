import React, { ChangeEvent, useEffect, useState } from 'react';
import { type ProductAttributesProps, type ProductProps } from './ProductAttributes.types';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import { useForm, FormProvider } from 'react-hook-form';
import useCart from '@/hooks/useCart';
import ItemConfirmation from '../Modal/ItemConfirmation';
import { useAtom } from 'jotai';
import {
  CheckOutHref,
  CheckOutText,
  confirmationClickType,
  confirmationModelDescription,
  confirmationModelTitle,
  confirmationSampleWarning,
  createNewProjectDetails,
  itemConfirmationModal,
  loaderAddItem,
  modalOpen,
} from '../Modal/atom';
import cartAtom, { cartDetailAtom, stopDataSync } from '@/core/cartStore/cartState';
import { cn } from '@/utils/cn';
import SampleCartSvg from '@/core/atoms/Icons/SampleCartSvg';
import Cookies from 'js-cookie';
import { IS_PROUSER } from 'src/config';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import Confirmation from '../Modal/Confirmation';
import { ClickType } from '../Modal/modal.type';
import { authorizationAtom } from '@/data/atoms/authorization';
import { triggerEvent } from '@/utils/eventTracking';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { event } from '@/config';

interface PDPCartButtonProps extends ProductAttributesProps {
  totalUnits: number;
  ProductCode: string;
}

type PDPAddToCartData = {
  currency: string;
  value: number;
  items: {
    item_brand: string;
    item_category: string;
    item_category2: string;
    item_category3: string;
    item_category4?: string;
    item_category5: string;
    item_id: string;
    item_name: string;
    price: number;
    discount: number;
    quantity: number;
  }[];
} | null;

const PDPCartButton: React.FC<PDPCartButtonProps> = (props) => {
  const { data, totalUnits, ProductCode } = props;
  const formMethods = useForm();
  const [cartItem, setCartItem] = useState('1');
  const { t } = useI18n();
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [, setNewProjectDetails] = useAtom(createNewProjectDetails);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [finalSampleCost, setSampleCost] = useState('0');
  const [buttonText, setButtonText] = useState<string>(finalSampleCost);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  useEffect(() => {
    if (totalUnits > 0) setCartItem(totalUnits.toString());
  }, [totalUnits]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseInt(value) >= 1) {
      setCartItem(value);
    } else {
      setCartItem('');
    }
  };
  const {
    addToCart,
    getLocalNumberOfSamples,
    isProductInCart,
    isProductInLocalCart,
    getGuestCart,
  } = useCart(false);
  const [isItemConfirmationModalOpen] = useAtom(itemConfirmationModal);
  const [localCart] = useAtom(cartAtom);
  const [loaderItem] = useAtom(loaderAddItem);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const SampleModalAlertSummary = props?.fields?.SampleModalAlertSummary?.value;
  const [, setCheckOutHref] = useAtom(CheckOutHref);
  const [, setCheckOutText] = useAtom(CheckOutText);
  const isSample =
    data?.IsSample === true ||
    data?.IsSampleAvailableRetail === true ||
    data?.IsSampleAvailablePro === true;
  const isSamplePage = data?.IsSample === true;
  const ProductId = isSample ? data?.SampleSKU : data?.PriceSchedule?.xp.ProductId;
  const isInCart = isProductInCart(ProductId ?? '');
  const isInLocalCart = isProductInLocalCart(ProductId ?? '');

  const [isModalOpen, setIsModalOpen] = useAtom(modalOpen);
  const [, setTitle] = useAtom(confirmationModelTitle);
  const [, setDescription] = useAtom(confirmationModelDescription);
  const [, setClickType] = useAtom(confirmationClickType);
  const [, setSampleWarning] = useAtom(confirmationSampleWarning);
  const [, setStopDataSync] = useAtom(stopDataSync);
  const [pdpAddtocartEventData, setPDPAddToCartEventData] = useState<PDPAddToCartData>(null);

  const calculateFinalSampleCost = (data: ProductProps, isProUser: boolean) => {
    const sampleCost = data
      ? data?.IsSample
        ? data?.PriceSchedule?.PriceBreaks[0]?.SalePrice
        : data?.SamplePriceSchedule?.PriceBreaks[0]?.SalePrice
      : 0;

    const sampleDictionaryValue = t('PDPAttributes_AddSample');
    const finalSampleCost = isProUser
      ? sampleDictionaryValue.replace(/(\{.*?\})/g, () => `$${0}`)
      : sampleDictionaryValue.replace(/(\{.*?\})/g, () => `$${sampleCost}`);

    return finalSampleCost;
  };

  useEffect(() => {
    const proUserCookie = Cookies.get(IS_PROUSER);
    if (proUserCookie !== undefined) setIsProUser(proUserCookie === 'true');

    const finalSampleCost = calculateFinalSampleCost(data, isProUser);
    setSampleCost(finalSampleCost);

    // Update button text if not clicked
    if (!buttonClicked) {
      setButtonText(finalSampleCost);
    }

    const itemPresent = localCart.find(
      (item) =>
        item?.isSample === true &&
        item?.productId?.replace(/SS/g, '') ===
          (ProductCode?.replace(/SS/g, '') ??
            data?.PriceSchedule?.xp?.ProductId?.replace(/SS/g, ''))
    );
    if (itemPresent) {
      setButtonText(t('Tag_SampleInCart'));
      setIsDisabled(true);
    } else {
      setIsDisabled(false); // Reset if no item is present
      setButtonText(finalSampleCost); // Reset button text
    }
    if ((isInCart || isInLocalCart) && !buttonClicked) {
      const isSample = isInLocalCart
        ? localCart.find((item) => item.productId === data?.SampleSKU)?.isSample
        : cartDetailState?.Samples?.CartItem.find(
            (item) => item.ProductId === data?.PriceSchedule?.xp.ProductId
          );

      if (isSample) {
        setButtonText(t('Tag_SampleInCart'));
        setIsDisabled(true);
        return;
      }
    }
  }, [
    isInCart,
    isInLocalCart,
    buttonClicked,
    t,
    localCart,
    data,
    cartDetailState,
    ProductCode,
    isProUser,
  ]);

  useEffect(() => {
    if (isAuthenticated && cartDetailState) {
      const isItemPresent = cartDetailState?.Samples?.CartItem?.find(
        (item) => item?.ProductId?.replace(/SS/g, '') === ProductCode?.replace(/SS/g, '')
      );

      if (isItemPresent && isItemPresent !== undefined) {
        setIsDisabled(true);
      }
    }
  }, [cartDetailState, isAuthenticated, ProductCode]);

  const handleClick = (isSample = false) => {
    const quantity = isSample ? '1' : cartItem;
    const ProductId: string =
      isSample && !data?.IsSample ? data?.SampleSKU : data?.PriceSchedule?.xp.ProductId;
    const localNumberOfSamples = getLocalNumberOfSamples();
    const updateProductUrl = ProductId?.replace(/SS/g, '');
    const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${updateProductUrl}?$PDPThumbnail$`;

    const isInCart = isProductInCart(ProductId ?? '');
    const isInLocalCart = isProductInLocalCart(ProductId ?? '');

    if (isSample && (isInCart || isInLocalCart)) {
      setButtonText(t('Tag_SampleInCart'));
      setIsDisabled(true);
      return;
    }

    if (isSample && localNumberOfSamples >= 15) {
      setSampleWarning(true);
      setTitle(t('PDPAttributes_SampleLimitTitle'));
      setDescription(t('PDPAttributes_SampleLimitText'));
      setClickType(ClickType.Cart);
      setIsModalOpen(true);
      return;
    }

    addToCart({
      productId: ProductId ?? '',
      quantity,
      isSample,
      sku: data.PriceSchedule?.xp?.ProductId ?? data?.Product?.xp?.ProductId,
      samplemodalAlertSummary: SampleModalAlertSummary,
      sku_image_url: productImage,
      isSpecialOrder: data?.IsSpecialOrder,
    });

    setCheckOutHref(props?.fields?.CheckoutCTA?.value?.href);
    setCheckOutText(props?.fields?.CheckoutCTA?.value?.text);
    if (isSample) {
      setButtonText(t('Tag_SampleInCart'));
      setIsDisabled(true);
      setButtonClicked(true); // Mark button as clicked
    }
    if (data) {
      const priceBreak = data?.PriceSchedule?.PriceBreaks?.[0];
      const samplePriceBreak = data?.SamplePriceSchedule?.PriceBreaks?.[0];
      const eventData = {
        currency: 'USD',
        value: isSamplePage
          ? Number(priceBreak?.SalePrice)
          : isSample
            ? Number(Number(samplePriceBreak?.SalePrice).toFixed(2))
            : Number(
                (Number(data?.PriceSchedule?.PriceBreaks[0]?.SalePrice) * Number(cartItem)).toFixed(
                  2
                )
              ),
        items: [
          {
            item_id: ProductId || '',
            item_name: isSample ? data?.SampleName || '' : data?.ProductName || '',
            item_brand: data?.Brand || '',
            item_category: isSample ? 'Sample' : data?.ProductHierarchy1 || '',
            item_category2: data?.ProductHierarchy2 || '',
            item_category3: data?.MaterialGroupName || '',
            item_category4: data?.CollectionName || '',
            item_category5: '',
            price: isSamplePage
              ? Number(priceBreak?.SalePrice)
              : isSample
                ? Number(samplePriceBreak?.SalePrice)
                : Number(data?.PriceSchedule?.PriceBreaks[0]?.SalePrice),
            quantity: Number(cartItem),
            discount: isSamplePage
              ? Number(Number(priceBreak?.Price) - Number(priceBreak?.SalePrice))
              : isSample
                ? Number(samplePriceBreak?.Price) === 0
                  ? 0
                  : Number(
                      (
                        Number(samplePriceBreak?.Price) - Number(samplePriceBreak?.SalePrice)
                      ).toFixed(2)
                    )
                : Number(priceBreak?.Price) === 0
                  ? 0
                  : Number((Number(priceBreak?.Price) - Number(priceBreak?.SalePrice)).toFixed(2)),
          },
        ],
      };
      setPDPAddToCartEventData(eventData);
      if (typeof window !== 'undefined' && 'rfk' in window) {
        window.rfk.push({
          value: {
            products: [
              {
                sku: ProductId,
                quantity: Number(quantity),
                price: isSample
                  ? Number(Number(samplePriceBreak?.SalePrice).toFixed(2))
                  : Number(
                      (
                        Number(data?.PriceSchedule?.PriceBreaks[0]?.SalePrice) * Number(cartItem)
                      ).toFixed(2)
                    ),
                price_original: isSample
                  ? Number(Number(samplePriceBreak?.SalePrice).toFixed(2))
                  : Number(Number(data?.PriceSchedule?.PriceBreaks[0]?.SalePrice).toFixed(2)),
              },
            ],
          },
          type: 'a2c',
          name: 'cart',
        });
      }
    }
  };

  // getting current quantity
  useEffect(() => {
    if (cartItem) {
      setNewProjectDetails({
        productId: ProductId,
        quantity: cartItem ?? '',
        unit: 'BX',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItem]);

  useEffect(() => {
    setStopDataSync(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pdpAddtocartEventData) {
      triggerEvent({
        event: event?.ADD_TO_CART,
        ecommerce: {
          currency: pdpAddtocartEventData?.currency,
          value: pdpAddtocartEventData?.value,
          items: pdpAddtocartEventData?.items,
        },
      });
    }
  }, [pdpAddtocartEventData]);

  useEffect(() => {
    if (localCart?.length > 0) {
      getGuestCart();
    }
  }, [localCart]);
  return (
    <div>
      {data?.IsSample === false &&
        ((data?.IsOnlinePurchasableRetail === true && !isProUser) ||
          (data?.IsOnlinePurchasablePro === true && isProUser)) && (
          <div className="flex flex-wrap gap-x-3 mt-6">
            <FormProvider {...formMethods}>
              <div className="flex min-w-32 text-sm p-3 items-center justify-center border border-opacity-65 border-black rounded-md h-12">
                <input
                  type="number"
                  min="1"
                  value={cartItem}
                  onChange={handleInputChange}
                  className="border-none outline-none p-0 w-14 text-dark-gray text-center font-latoBold text-sm font-normal shadow-none"
                />
                <span className="mx-2">|</span>
                <label className="text-center font-latoBold text-sm uppercase mb-0 ml-3 text-dark-gray">
                  {data?.SellingUOM === 'EA' ? t('label_QTY') : t('PDPCalculator_Boxes')}
                  {}
                </label>
              </div>
            </FormProvider>
            <div className="flex-grow mb-3">
              <Button
                isTypeSubmit={true}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                className={cn('min-h-11 w-full text-sm tracking-widest font-latoBold', {
                  'bg-button-gray border border-text-gray border-opacity-65 text-gray cursor-auto hover:bg-button-gray hover:shadow-none':
                    cartItem === '',
                })}
                onClick={() => handleClick(false)}
                disabled={cartItem === ''}
              >
                {t('PDPAttributes_AddToCart')}
              </Button>
            </div>
          </div>
        )}

      {data?.IsSample === true ||
      (data?.IsSampleAvailableRetail === true && !isProUser) ||
      (data?.IsSampleAvailablePro && isProUser) ? (
        <div className="flex flex-wrap gap-x-3 mb-3">
          <Button
            isTypeSubmit={true}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            onClick={() => handleClick(true)}
            className={cn(
              'min-h-11 w-full border border-black border-opacity-65 text-black bg-white text-sm font-latoBold md:leading-4 tracking-widest',
              {
                'bg-button-gray border border-black border-opacity-65 text-gray cursor-not-allowed hover:bg-button-gray hover:shadow-none':
                  isDisabled,
              },
              {
                'hover:text-sm hover:font-latoBold text-dark-gray hover:shadow-md hover:border-black hover:border-opacity-65 hover:text-dark-gray hover:bg-white':
                  !isDisabled,
              }
            )}
            disabled={isDisabled}
          >
            <span className="pr-1.5 md:h-6 hidden lg:block ">
              <SampleCartSvg isDisabled={isDisabled} />
            </span>
            {buttonText}
          </Button>
        </div>
      ) : (
        ''
      )}
      {loaderItem && <LoaderSpinner className="tileshop-loader-wrapper-pdp-page" />}
      {isItemConfirmationModalOpen ? <ItemConfirmation /> : null}
      {isModalOpen ? <Confirmation /> : null}
    </div>
  );
};

export default PDPCartButton;
