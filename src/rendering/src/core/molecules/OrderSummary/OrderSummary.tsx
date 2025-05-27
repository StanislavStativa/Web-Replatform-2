import React, { useEffect, useState } from 'react';
import { OrderSummaryProps } from './OrderSummary.type';
import { useI18n } from 'next-localization';
import Button from '@/core/atoms/Button/Button';
import { IoIosUnlock } from 'react-icons/io';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useMutation } from '@tanstack/react-query';
import { CartService } from '@/api/services/CartService';
import { PaymentService } from '@/api/services/PaymentService';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useRouter } from 'next/router';
import OrderSummaryGuest from './OrderSummaryGuest';
import {
  cartDetailAtom,
  errorCartData,
  shippingError,
  stopDataSync,
} from '@/core/cartStore/cartState';
import { cartShippingAddresData } from '@/data/atoms/cartShippingAddresData';
import { storePickupSelectedData } from '@/data/atoms/storePickupSelectedData';
import { IFullAddressType } from '../StoresPickup/StoresPickup.types';
import useLocalStorage from '@/utils/useLocalStorage';
import { CiWarning } from 'react-icons/ci';
import {
  creditCardEnteredData,
  creditCardError,
  creditCardInformation,
  isCreditValidationPassed,
} from '@/data/atoms/creditCardEnteredData';
import { paymentSelectedOption, paymentSelectedType } from '@/data/atoms/paymentSelectedOption';
import {
  ADDNEWADDRESS,
  COUNTRYNAMES,
  FORM_SUBMITTED_ERROR_MESSAGES,
  PAGENAME,
  PAYMENTOPTIONS,
} from '@/utils/constants';
import { useCartState } from '@/core/cartStore/useCartState';
import { useShipStore } from '@/store/useShipStore';
import { useShipTo } from '@/hooks/useShipTo';
import { cartSubmitError, cartWecoError } from '../Modal/atom';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import Cookies from 'js-cookie';
import { IS_PROUSER, USR_PREFERRED_STORE } from '@/config';
import { getCardBrand } from '@/utils/card';
import { useOrderSummary } from '@/hooks/useOrderSummary';
import { renderGCROptIn } from '@/utils/eventTracking';

const OrderSummary = (props: OrderSummaryProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { Title, CTA, SignInLink } = props?.rendering?.fields;
  const { PageName } = props?.rendering?.params;
  const { setData } = useLocalStorage();
  const { t } = useI18n();
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const { removeCart } = useCartState();
  const [, setStopDataSync] = useAtom(stopDataSync);
  const [customerAddressFormData] = useAtom(cartShippingAddresData);
  const [storePickupFormData] = useAtom<IFullAddressType>(storePickupSelectedData);
  const [creditCardEnteredAddressData] = useAtom(creditCardEnteredData);
  const [creditCardEnteredCardData] = useAtom(creditCardInformation);
  const [, setCreditCartError] = useAtom(creditCardError);
  const [creditPaymentSelectedOption, setCreditPaymentSelectedOption] =
    useAtom(paymentSelectedOption);
  const [paymentTypeId] = useAtom(paymentSelectedType);
  const [, setErrorCartData] = useAtom(errorCartData);
  const [, setShippingError] = useAtom(shippingError);
  const { removeSessionData, getSessionData } = useLocalStorage();
  const { selectedShipCTa, handleSetSelectedShipCta } = useShipStore();
  const { isOnlyItems, isOnlySamples, sampleAndItem } = useShipTo();
  const [] = useAtom(cartShippingAddresData);
  const router = useRouter();
  const [, setCartWecoError] = useAtom(cartWecoError);
  const [, setCartSubmitError] = useAtom(cartSubmitError);
  const proUserCheck = Cookies.get(IS_PROUSER);
  const { fetchedCartData, isLoading, isRefetching } = useOrderSummary();
  const cpayRefrenceId = getSessionData('TTSCpayId');
  const isCompanyName =
    proUserCheck && proUserCheck === 'true'
      ? Boolean(
          customerAddressFormData?.state?.trim() &&
            customerAddressFormData?.addressLine1?.trim() &&
            customerAddressFormData?.zipCode?.trim()?.length === 5 &&
            customerAddressFormData?.city?.trim() &&
            customerAddressFormData?.companyName?.trim()
        )
      : Boolean(
          customerAddressFormData?.state?.trim() &&
            customerAddressFormData?.addressLine1?.trim() &&
            customerAddressFormData?.zipCode?.trim()?.length === 5 &&
            customerAddressFormData?.city?.trim()
        );

  const isAddNewAddress = customerAddressFormData?.savedAddress === ADDNEWADDRESS;
  const isSavedAddress = Boolean(isAddNewAddress && isCompanyName);
  const [isCreditValidation] = useAtom(isCreditValidationPassed);
  const [, SetCartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);

  const mutation = useMutation({
    mutationFn: () => {
      return CartService.cartSetShippingAddress({
        customerAddress: isAddNewAddress
          ? {
              company: customerAddressFormData?.companyName,
              address: customerAddressFormData?.addressLine1,
              address2: customerAddressFormData?.addressLine2,
              city: customerAddressFormData?.city,
              state: customerAddressFormData?.state,
              zipCode: customerAddressFormData?.zipCode,
              isDefault: customerAddressFormData?.rememberMe,
              shipping: true,
              shippingInstructions: customerAddressFormData?.shippingInstructions,
            }
          : {
              id:
                isOnlyItems && selectedShipCTa.selectedCta === 'pick'
                  ? ''
                  : customerAddressFormData?.savedAddress,
            },
        partialClientStoreInfo: {
          sapStoreId: storePickupFormData?.sapStoreId,
          storeId: storePickupFormData?.storeId,
          storeName: storePickupFormData?.StoreName,
          address1: storePickupFormData?.AddressLine1,

          city: storePickupFormData?.City,
          state: storePickupFormData?.StateCode,
          country: COUNTRYNAMES.US,
          postalCode: storePickupFormData?.PostalCode,
        },
        /*
isStorePickup case
1:- User can toggle b/w two ctas and only one need to be selected if "isOnlyItems" is true
and selected is ship to new then pass false otherwise as per storeId presence
2:- if only samples then no field for pickup default false
3:- if both sample and item then if user is not selecting pickup then it will be false
*/
        isStorePickup:
          isOnlyItems && selectedShipCTa.selectedCta === 'ship'
            ? false
            : isOnlySamples
              ? false
              : sampleAndItem && selectedShipCTa.selectedCta !== 'pick'
                ? false
                : Boolean(storePickupFormData?.storeId),
        // Todo
      });
    },
    onSuccess: (data) => {
      if (data?.Order === null || data?.WECOBasket === null) {
        setShippingError(data?.Message);
      } else if (data?.Order !== null || data?.WECOBasket !== null) {
        setShippingError(null);
        const isStorePickup =
          isOnlyItems && selectedShipCTa.selectedCta === 'ship'
            ? false
            : isOnlySamples
              ? false
              : sampleAndItem && selectedShipCTa.selectedCta !== 'pick'
                ? false
                : Boolean(storePickupFormData?.storeId);
        if (isStorePickup && storePickupFormData?.sapStoreId) {
          Cookies.set(USR_PREFERRED_STORE, storePickupFormData?.sapStoreId);
        }

        setData('oderId', fetchedCartData?.Order?.ID); // Added for order review and confirmation

        router.push(CTA?.value?.href);
      } else {
        setShippingError(FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT);
      }
    },
    onError: () => {
      setShippingError(FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT);
    },
  });

  const cartProcessMutation = useMutation({
    mutationFn: () => {
      if (creditPaymentSelectedOption === PAYMENTOPTIONS.CREDITCARD) {
        return CartService.cartProcessCart({
          customerAddress: {
            id: '',
            company: creditCardEnteredAddressData?.companyName,
            address: creditCardEnteredAddressData?.addressLine1,
            address2: creditCardEnteredAddressData?.addressLine2 ?? '',
            city: creditCardEnteredAddressData?.city,
            phone: creditCardEnteredAddressData?.phoneNumber ?? '',
            state: creditCardEnteredAddressData?.state,
            zipCode: creditCardEnteredAddressData?.zipCode,
            shipping: creditCardEnteredAddressData?.shipping,
            billing: creditCardEnteredAddressData?.billing,
            userId: '',
            isDefault: creditCardEnteredAddressData?.default,
            shippingInstructions: creditCardEnteredAddressData?.addressLine1,
          },
          buyerCreditCard: {
            id: '',
            editable: true,
            token: creditCardEnteredCardData?.tokenid,
            cardType: getCardBrand(creditCardEnteredCardData?.tokenid),
            partialAccountNumber: (creditCardEnteredCardData?.tokenid as string).slice(-4),
            cardholderName: creditCardEnteredCardData?.cardHolderName,
            expirationDate: `${creditCardEnteredCardData?.year}-${creditCardEnteredCardData?.month}-01`,
            cardZipCode: creditCardEnteredCardData?.zipCode,
            creditReferenceId: '',
          },
          paymentType: paymentTypeId,
        });
      } else {
        return CartService.cartProcessCart({
          customerAddress: {
            id: '',
            company: creditCardEnteredAddressData?.companyName,
            address: creditCardEnteredAddressData?.addressLine1,
            address2: creditCardEnteredAddressData?.addressLine2 ?? '',
            city: creditCardEnteredAddressData?.city,
            phone: creditCardEnteredAddressData?.phoneNumber ?? '',
            state: creditCardEnteredAddressData?.state,
            zipCode: creditCardEnteredAddressData?.zipCode,
            shipping: creditCardEnteredAddressData?.shipping,
            billing: creditCardEnteredAddressData?.billing,
            userId: '',
            isDefault: creditCardEnteredAddressData?.default,
            shippingInstructions: creditCardEnteredAddressData?.addressLine1,
          },
          buyerCreditCard: {
            id: '',
            editable: true,
            token: '',
            cardType: '',
            partialAccountNumber: '',
            cardholderName: '',
            expirationDate: '',
            cardZipCode: '',
            creditReferenceId: '',
          },
          paymentType: paymentTypeId,
        });
      }
    },
    onSuccess: () => {
      handleSetSelectedShipCta({ selectedCta: null });

      router.push(CTA?.value?.href);
    },
    onError: () => {
      setCreditCartError({
        isError: true,
        errorMessage: FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT,
      });
    },
  });
  const submitCartMutation = useMutation({
    mutationFn: () => {
      return CartService.cartSubmitCart();
    },
    onSuccess: (data) => {
      if (data) {
        renderGCROptIn(data?.ID, data?.Order?.FromUser?.Email, data?.EstimatedDeliveryDate);
        setData('oderId', data?.ID);
        SetCartDetailState(null);
        removeCart();
        setTimeout(() => {
          router.push(CTA?.value?.href);
        }, 200);
      } else {
        setCartSubmitError(true);
      }
    },
    onError: () => {
      setCartSubmitError(true);
    },
  });

  const creditCardPaymentMutation = useMutation({
    mutationFn: () => {
      return PaymentService.paymentInitiatePayment({
        paymentTypeId: Number(paymentTypeId),
        cardNumber: creditCardEnteredCardData?.cardNumber,
        cardType: getCardBrand(creditCardEnteredCardData?.tokenid),
        month: creditCardEnteredCardData?.month,
        year: creditCardEnteredCardData?.year,
        transactionAmount: fetchedCartData?.Order?.Total,
        customerName: creditCardEnteredCardData?.cardHolderName,
        cvvCode: creditCardEnteredCardData?.CvdCode,
        cardZipCode: creditCardEnteredCardData?.zipCode,
        companyName: creditCardEnteredAddressData?.companyName,
        name: creditCardEnteredAddressData?.companyName,
        addressLine1: creditCardEnteredAddressData?.addressLine1,
        city: creditCardEnteredAddressData?.city,
        state: creditCardEnteredAddressData?.state,
        zipCode: creditCardEnteredAddressData?.zipCode,
        firstName: creditCardEnteredAddressData?.firstName ?? '',
        lastName: creditCardEnteredAddressData?.lastName ?? '',
        country: COUNTRYNAMES.US,
        email: creditCardEnteredAddressData?.email ?? '',
        phoneNumber: creditCardEnteredAddressData?.phoneNumber ?? '',
        tokenid: creditCardEnteredCardData?.tokenid,
        citizensPayReferenceId:
          cpayRefrenceId && cpayRefrenceId !== undefined ? cpayRefrenceId : '',
      });
    },
    onSuccess: (_response) => {
      if (_response?.status === 'Y') {
        _response?.cards && setData('cartTokenId', _response?.cards[0]?.tokenid);

        cartProcessMutation.mutate();
      }
    },
    onError: () => {
      removeSessionData('TTSCpayId');
      setCreditCartError({
        isError: true,
        errorMessage: FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT,
      });
    },
  });

  const { mutate: createBasket, isPending: isCreateBasketPending } = useMutation({
    mutationFn: async () => {
      return await CartService.cartWecoCreateBasket();
    },
    onSuccess: (data) => {
      if (data?.StatusCode === '200') {
        setErrorCartData([]);
        setStopDataSync(true);
        setCartWecoError(false);
        router.push(CTA?.value?.href);
      } else if (data?.StatusCode === '400') {
        setErrorCartData(data?.CartResponses);
      } else {
        setCartWecoError(true);
      }
    },
    onError: () => {
      setCartWecoError(true);
    },
  });
  const handleSecureCheckoutClick = () => {
    setCartWecoError(false);
    setCartSubmitError(false);
    if (PageName === PAGENAME.CART) {
      if (isOnlySamples === true) {
        handleSetSelectedShipCta({ selectedCta: null });
      }
      createBasket();
    } else if (PageName === PAGENAME.SHIPPING) {
      setShippingError(null);
      setCreditPaymentSelectedOption(null);
      mutation.mutate();
    } else if (PageName === PAGENAME.PAYMENT) {
      if (
        proUserCheck &&
        proUserCheck === 'true' &&
        isOnlySamples &&
        fetchedCartData?.Order?.Total === 0
      ) {
        handleSetSelectedShipCta({ selectedCta: null });

        router.push(CTA?.value?.href);
      } else {
        cartProcessMutation.mutate();
      }
    } else if (PageName === PAGENAME.REVIEW) {
      submitCartMutation.mutate();
    } else {
      router.push(CTA?.value?.href);
    }
    setData('oderId', fetchedCartData?.Order?.ID);
  };

  const isCardInfoFilled = () => {
    return (
      creditCardEnteredCardData?.tokenid?.trim() &&
      creditCardEnteredCardData?.cardHolderName?.trim() &&
      creditCardEnteredCardData?.zipCode?.trim()
    );
  };

  const isSampleNotReadyForDisplay = fetchedCartData?.LineItems?.some(
    (item: { Product: { xp: { ReadyForDisplay: boolean } } }) =>
      item.Product?.xp?.ReadyForDisplay === false
  );

  /*
Disabled cases
1:- If payment page and user has not selected any kin of payment option "credit card" | "Invoice"
2:- If Shipping page and user has only items in cart then only Ship to CTA are visible
    user need to select only one, if selected then button enabled
3:- If Shipping page and both sample and item in cart, user need to select either from saved address or 
add new address
4: - IF payment type is credit and details are not filled and credit card error is true
5: - IF payment type  credit card error is true
6: -If Shipping page and user has only items in cart then only Ship to CTA are visible
    user need to select only one and in shipping address should be filled either by dropdown or custom
*/
  const isSecureCheckoutDisabled =
    isSampleNotReadyForDisplay ||
    (PageName === PAGENAME.PAYMENT && !creditPaymentSelectedOption) ||
    (PageName === PAGENAME.SHIPPING && !selectedShipCTa.selectedCta && isOnlyItems) ||
    (PageName === PAGENAME.SHIPPING && sampleAndItem && !isSavedAddress && !isCompanyName) ||
    (PageName === PAGENAME.PAYMENT &&
      !isCardInfoFilled() &&
      creditPaymentSelectedOption === PAYMENTOPTIONS.CREDITCARD) ||
    (PageName === PAGENAME.PAYMENT &&
      isCreditValidation &&
      creditPaymentSelectedOption === PAYMENTOPTIONS.CREDITCARD) ||
    (PageName === PAGENAME.SHIPPING &&
      selectedShipCTa.selectedCta === 'ship' &&
      isOnlyItems &&
      !isSavedAddress &&
      !isCompanyName) ||
    (PageName === PAGENAME.SHIPPING && isOnlySamples && !isSavedAddress && !isCompanyName);
  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  if (!hasMounted) {
    return null;
  }
  return (
    <div
      className={`order-summary-top md:pb-8 ordersummary md:top-20 ${PageName === PAGENAME.CART ? 'md:mt-10 md:pt-24' : 'md:mt-10 md:pt-14'}`}
    >
      {(isCreateBasketPending ||
        isLoading ||
        mutation?.isPending ||
        creditCardPaymentMutation?.isPending ||
        submitCartMutation?.isPending ||
        cartProcessMutation?.isPending) && <LoaderSpinner />}
      {isAuthenticated ? (
        <div>
          {(isLoading || isRefetching) && <LoaderSpinner />}
          {fetchedCartData?.LineItems && fetchedCartData?.LineItems?.length > 0 && !isLoading ? (
            <>
              <div className=" bg-tonal-gray rounded-md md:mr-5 lg:mr-0 specific-margin">
                <div className="py-5 px-6 flex flex-col gap-y-3 ">
                  <Text field={Title} tag="h4" className="text-center" />
                  <div className="flex flex-col gap-y-6">
                    <hr className="text-dark-gray opacity-30" />
                    <div className="flex justify-between">
                      <div className=" flex flex-col gap-y-4 font-latoBold text-dark-gray">
                        <p>{t('Order_ProductTotal')}</p>
                        {fetchedCartData?.Order?.PromotionDiscount !== 0 && (
                          <p>{t('Order_Discount')}</p>
                        )}

                        <p>{t('Order_Shipping')}</p>
                        <p>{t('Order_EstimatedTax')}</p>
                      </div>
                      <div className=" flex flex-col text-dark-gray text-end gap-y-4">
                        <div className="min-w-13">
                          {isLoading || isRefetching ? (
                            <p className="animate-pulse bg-slate-200 rounded h-6"></p>
                          ) : (
                            <p>${fetchedCartData?.Order?.Subtotal?.toFixed(2)}</p>
                          )}
                        </div>

                        {fetchedCartData?.Order?.PromotionDiscount !== 0 && (
                          <>
                            {isLoading || isRefetching ? (
                              <p className="animate-pulse bg-slate-200 rounded h-6"></p>
                            ) : (
                              <p className="text-light-slate-red">
                                -${fetchedCartData?.Order?.PromotionDiscount}
                              </p>
                            )}
                          </>
                        )}

                        <p>
                          <>
                            {isLoading || isRefetching ? (
                              <p className="animate-pulse bg-slate-200 rounded h-6"></p>
                            ) : (
                              <>
                                {PageName === PAGENAME.CART
                                  ? fetchedCartData?.Order?.ShippingCost > 0
                                    ? `$${fetchedCartData?.Order?.ShippingCost?.toFixed(2)}`
                                    : 'TBD'
                                  : `$${fetchedCartData?.Order?.ShippingCost?.toFixed(2)}`}
                              </>
                            )}
                          </>
                        </p>
                        <p>
                          <>
                            {isLoading || isRefetching ? (
                              <p className="animate-pulse bg-slate-200 rounded h-6"></p>
                            ) : (
                              <>
                                {PageName === PAGENAME.CART
                                  ? fetchedCartData?.Order?.TaxCost > 0
                                    ? `$${fetchedCartData?.Order?.TaxCost?.toFixed(2)}`
                                    : 'TBD'
                                  : `$${fetchedCartData?.Order?.TaxCost?.toFixed(2)}`}
                              </>
                            )}
                          </>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <hr className="text-dark-gray opacity-30" />
                      <div className="flex justify-between">
                        <p className="font-latoBold text-dark-gray text-xl">
                          {t('Order_SubTotal')}
                        </p>

                        <div className="min-w-20">
                          {isLoading || isRefetching ? (
                            <p className="animate-pulse bg-slate-200 rounded h-6"></p>
                          ) : (
                            <p className="font-latoBold text-dark-gray text-end text-xl">
                              ${fetchedCartData?.Order?.Total?.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <hr className="text-dark-gray opacity-30" />
                    </div>

                    <div className="flex justify-center mt-3 flex-col">
                      <Button
                        className={` flex gap-x-3 text-base ${isSecureCheckoutDisabled ? 'opacity-55 hover:opacity-55 hover:bg-dark-gray' : ''}`}
                        onClick={handleSecureCheckoutClick}
                        disabled={isSecureCheckoutDisabled}
                        isCTATextInCaps={props?.params?.IsCTATextInCaps}
                      >
                        <div className="w-7 h-7 flex items-center justify-center">
                          <IoIosUnlock size={20} />
                        </div>

                        {CTA?.value?.title}
                      </Button>
                      <p className="text-center mt-3">{t('message_tax_shipping')}</p>
                    </div>
                  </div>
                </div>

                {/* {proUserCheck === undefined && (
                  <RichText
                    field={CitizenPayMessage}
                    className={
                      'mt-6 flex  md:hidden items-center justify-center flex-col pb-11  occitizenPayMobile-rte'
                    }
                  />
                )} */}
              </div>
              <div className=" w-full flex items-center gap-x-1  rounded-xl border border-gray-300  p-3  mb-2 mt-8 flex-row">
                <div className="w-8 h-5 mr-2">
                  <CiWarning size={30} />
                </div>
                <p>{t('message_shipping_restriction')}</p>
              </div>
              {/* {proUserCheck === undefined && (
                <RichText
                  field={CitizenPayMessage}
                  className={
                    'mt-6 hidden  md:flex items-center justify-center flex-col occitizenPay-rte'
                  }
                />
              )} */}
            </>
          ) : null}
        </div>
      ) : (
        <OrderSummaryGuest
          Title={Title}
          isAuthenticated={isAuthenticated}
          isCtaCaps={props?.params?.IsCTATextInCaps}
          SignInLink={SignInLink}
        />
      )}
    </div>
  );
};
export default OrderSummary;
