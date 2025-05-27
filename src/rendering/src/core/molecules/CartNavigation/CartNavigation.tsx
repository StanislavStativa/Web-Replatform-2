import React, { memo, useEffect, useState } from 'react';
import { ITypesCartNavigation } from './CartNavigation.type';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import useLocalStorage from '@/utils/useLocalStorage';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useCartState } from '@/core/cartStore/useCartState';
import { cartShippingAddresData } from '@/data/atoms/cartShippingAddresData';
import cartAtom, {
  cartDetailAtom,
  errorCartData,
  shippingError,
  stopDataSync,
} from '@/core/cartStore/cartState';
import { IFullAddressType } from '../StoresPickup/StoresPickup.types';
import { storePickupSelectedData } from '@/data/atoms/storePickupSelectedData';
import {
  creditCardEnteredData,
  creditCardError,
  creditCardInformation,
  isCreditValidationPassed,
} from '@/data/atoms/creditCardEnteredData';
import { paymentSelectedOption, paymentSelectedType } from '@/data/atoms/paymentSelectedOption';
import { useShipStore } from '@/store/useShipStore';
import { useShipTo } from '@/hooks/useShipTo';
import { cartSubmitError, cartWecoError } from '../Modal/atom';
import { useMutation } from '@tanstack/react-query';
import {
  ADDNEWADDRESS,
  COUNTRYNAMES,
  FORM_SUBMITTED_ERROR_MESSAGES,
  PAGENAME,
  PAYMENTOPTIONS,
} from '@/utils/constants';
import { CartService } from '@/api/services/CartService';
import { PaymentService } from '@/api/services/PaymentService';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from 'react-icons/io';
import { RiLock2Line } from 'react-icons/ri';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import Cookies from 'js-cookie';
import { IS_PROUSER, USR_PREFERRED_STORE } from '@/config';
import { getCardBrand } from '@/utils/card';
import { useOrderSummary } from '@/hooks/useOrderSummary';
import { renderGCROptIn } from '@/utils/eventTracking';
const CartNavigation = (props: ITypesCartNavigation) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { CTA, SecondaryCTA, SignInLink } = props?.rendering?.fields;
  const { PageName } = props?.rendering?.params;
  const { uid } = props?.rendering;
  const { setData, removeSessionData, getSessionData } = useLocalStorage();
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [localCart] = useAtom(cartAtom);
  const { removeCart } = useCartState();
  const [, setStopDataSync] = useAtom(stopDataSync);
  const [customerAddressFormData] = useAtom(cartShippingAddresData);
  const [storePickupFormData] = useAtom<IFullAddressType>(storePickupSelectedData);
  const [creditCardEnteredAddressData] = useAtom(creditCardEnteredData);
  const [creditCardEnteredCardData] = useAtom(creditCardInformation);
  const [, setShippingError] = useAtom(shippingError);

  const [, setCreditCartError] = useAtom(creditCardError);
  const [creditPaymentSelectedOption, setCreditPaymentSelectedOption] =
    useAtom(paymentSelectedOption);
  const [paymentTypeId] = useAtom(paymentSelectedType);
  const [, setErrorCartData] = useAtom(errorCartData);
  const { selectedShipCTa, handleSetSelectedShipCta } = useShipStore();
  const { isOnlyItems, isOnlySamples, sampleAndItem } = useShipTo();
  const [] = useAtom(cartShippingAddresData);
  const router = useRouter();

  const [, setCartWecoError] = useAtom(cartWecoError);
  const [, setCartSubmitError] = useAtom(cartSubmitError);

  const [isCreditValidation] = useAtom(isCreditValidationPassed);
  const proUserCheck = Cookies.get(IS_PROUSER);
  const { isLoading, orderTotal, orderSummaryLength, orderId, isSampleNotReadyForDisplay } =
    useOrderSummary(false);
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
  const [cartDetailState, SetCartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);

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

        setData('oderId', orderId); // Added for order review and confirmation

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
            creditReferenceId: cpayRefrenceId && cpayRefrenceId !== undefined ? cpayRefrenceId : '',
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
            creditReferenceId: cpayRefrenceId && cpayRefrenceId !== undefined ? cpayRefrenceId : '',
          },
          paymentType: paymentTypeId,
        });
      }
    },
    onSuccess: () => {
      handleSetSelectedShipCta({ selectedCta: null });

      router.push(CTA?.value?.href);
      removeSessionData('TTSCpayId');
    },
    onError: () => {
      removeSessionData('TTSCpayId');
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
        transactionAmount: orderTotal,
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
    if (isAuthenticated) {
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
        if (proUserCheck && proUserCheck === 'true' && isOnlySamples && orderTotal === 0) {
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
      setData('oderId', orderId);
    } else {
      if (isOnlySamples === true) {
        handleSetSelectedShipCta({ selectedCta: null });
      }
      router.push(`${SignInLink?.value?.href}?returnurl=${router.asPath}`);
    }
  };

  const isCardInfoFilled = () => {
    return (
      creditCardEnteredCardData?.tokenid?.trim() &&
      creditCardEnteredCardData?.cardHolderName?.trim() &&
      creditCardEnteredCardData?.zipCode?.trim()
    );
  };

  const isGuestSampleNotReadyForDisplay = cartDetailState?.Samples?.CartItem?.some(
    (item) => item?.ReadyForDisplay === false
  );
  const isGuestItemNotReadyForDisplay = cartDetailState?.CartItems?.CartItem?.some(
    (item) => item?.ReadyForDisplay === false
  );
  /*
Disabled cases
1:- If payment page and user has not selected any kin of payment option "credit card" | "Invoice"
2:- If Shipping page and user has only items in cart then only Ship to CTA are visible
    user need to select only one, if selected then button enabled
3:- If Shipping page and both sample and item in cart, user need to select either from saved address or 
add new address
4: - IF payment type is credit and details are not filled
5: - IF payment type  credit card error is true
6: -If Shipping page and user has only items in cart then only Ship to CTA are visible
    user need to select only one and in shipping address should be filled either by dropdown or custom
*/
  const isSecureCheckoutDisabled =
    isGuestSampleNotReadyForDisplay ||
    isGuestItemNotReadyForDisplay ||
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
    <>
      {isCreateBasketPending ||
      (isAuthenticated && orderSummaryLength > 0 && !isLoading) ||
      (!isAuthenticated && localCart?.length > 0) ? (
        <section
          key={uid}
          className=" hidden mt-7 mb-8 px-5 lg:px-0 md:flex w-full flex-row justify-between items-center"
        >
          {(isCreateBasketPending ||
            mutation?.isPending ||
            creditCardPaymentMutation?.isPending ||
            submitCartMutation?.isPending ||
            cartProcessMutation?.isPending) && <LoaderSpinner />}
          <div>
            {SecondaryCTA && SecondaryCTA?.value?.href !== '' && (
              <Button
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                variant={ButtonVariant.OUTLINE}
                onClick={() => {
                  setCreditPaymentSelectedOption(null);
                  removeSessionData('TTSCpayId');
                  router.push(SecondaryCTA?.value?.href);
                }}
              >
                <IoIosArrowRoundBack size={30} className="mr-2" />
                {SecondaryCTA?.value?.title}
              </Button>
            )}
          </div>
          {CTA && CTA?.value?.href !== '' && (
            <Button
              isCTATextInCaps={props?.params?.IsCTATextInCaps}
              variant={ButtonVariant.OUTLINE}
              onClick={handleSecureCheckoutClick}
              disabled={isSecureCheckoutDisabled}
              className={`${isSecureCheckoutDisabled ? 'opacity-65 bg-button-gray border-gray hover:border-gray hover:text-dark-gray hover:font-normal hover:font-latoRegular ' : ''}`}
            >
              <>
                {PageName === PAGENAME.PAYMENT && (
                  <div className="w-7 h-7 flex items-center justify-center my-0.5">
                    <RiLock2Line size={20} className="mr-2" />
                  </div>
                )}
              </>
              {CTA?.value?.title}
              <>
                {PageName !== PAGENAME.PAYMENT && (
                  <IoIosArrowRoundForward size={30} className="mr-2" />
                )}
              </>
            </Button>
          )}
        </section>
      ) : null}
    </>
  );
};

export default memo(CartNavigation);
