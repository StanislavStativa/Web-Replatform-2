import {
  // BillingAddressFormErrorMessages,
  BillingAddressProps,
} from '@/core/molecules/BillingAddress/BillingAddress.types';

import CreditCardPayment from '../CreditCardPayment/CreditCardPayment';
import { useAtom } from 'jotai';
import { paymentSelectedOption } from '@/data/atoms/paymentSelectedOption';
import { creditCardEnteredData } from '@/data/atoms/creditCardEnteredData';
import { useEffect, useState } from 'react';
import { PAYMENTOPTIONS } from '@/utils/constants';
import { AddressService } from '@/api/services/AddressService';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { IS_PROUSER } from '@/config';
import { useShipTo } from '@/hooks/useShipTo';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const BillingAddress = (props: BillingAddressProps) => {
  const { Title } = props?.rendering?.fields;
  const proUserCheck = Cookies.get(IS_PROUSER);
  const { isOnlySamples } = useShipTo();
  const [, setCreditCardData] = useAtom(creditCardEnteredData);
  const [paymentSelectedOptionData] = useAtom(paymentSelectedOption);
  const [isProUser, setIsProUser] = useState<boolean | null>(null);
  const [addressBookTableData, setAddressBookTableData] = useState({
    companyName: '',
    street: '',
    address: '',
    zip: '',
    city: '',
    state: '',
    id: '',
    isDefault: '',
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    shipping: false,
    billing: false,
    default: false,
  });
  const { data: addressBookData, isLoading } = useQuery({
    queryKey: ['getAddressBookData'],
    queryFn: () => {
      return AddressService.addressGetAddresses(undefined, false, true);
    },
  });

  useEffect(() => {
    if (addressBookTableData) {
      const submitData = {
        companyName: addressBookTableData?.companyName,
        addressLine1: addressBookTableData?.street,
        addressLine2: addressBookTableData?.address,
        city: addressBookTableData?.city,
        state: addressBookTableData?.state,
        zipCode: addressBookTableData?.zip,
        phoneNumber: addressBookTableData?.phoneNumber,
        email: addressBookTableData?.email,
        firstName: addressBookTableData?.firstName,
        lastName: addressBookTableData?.lastName,
        shipping: addressBookTableData?.shipping,
        billing: addressBookTableData?.billing,
        default: addressBookTableData?.default,
      };
      setCreditCardData(submitData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressBookTableData]);

  useEffect(() => {
    if (addressBookData && addressBookData?.length > 0) {
      const modifiedAddressBook = addressBookData?.map(
        (item: {
          CompanyName: string;
          Street1: string;
          Street2: string;
          Zip: string;
          City: string;
          ID: string;
          Phone: string;
          LastName: string;
          FirstName: string;
          State: string;
          xp: { IsDefault: boolean; UserEmail: string; IsBilling: boolean; IsShipping: boolean };
        }) => {
          return {
            companyName: item.CompanyName,
            street: item?.Street1,
            address: item?.Street2,
            zip: item?.Zip,
            city: item?.City,
            id: item?.ID,
            isDefault: item?.xp?.IsDefault,
            phoneNumber: item?.Phone,
            firstName: item?.FirstName,
            lastName: item?.LastName,
            email: item?.xp?.UserEmail,
            state: item?.State,
            shipping: item?.xp?.IsShipping,
            billing: item?.xp?.IsBilling,
            default: item?.xp?.IsDefault,
          };
        }
      );
      const getDefault = modifiedAddressBook?.filter(
        (item: { isDefault: boolean }) => item?.isDefault === true
      );
      setAddressBookTableData(getDefault?.length > 0 ? getDefault?.[0] : modifiedAddressBook?.[0]);
    }
  }, [addressBookData]);

  useEffect(() => {
    if (proUserCheck) {
      setIsProUser(true);
    } else {
      setIsProUser(false);
    }
  }, [proUserCheck]);
  if (isOnlySamples && isProUser === true) {
    return (
      <div className="container mx-auto px-5 md:px-0 pt-4 md:pt-24">
        {isLoading && <LoaderSpinner />}
        <div className="grid grid-cols-10 rounded-xl  border border-border-gray bg-white py-6 px-10">
          <div className="flex flex-col col-span-full md:col-span-6 gap-y-4 ">
            <h4 className="text-2xl">{Title?.value}</h4>

            <div className="mb-6 text-wrap w-1/2">
              <p className="text-base font-bold">{addressBookTableData?.companyName}</p>
              <p className="text-base font-normal">{addressBookTableData?.street}</p>
              <p className="text-base font-normal">{addressBookTableData?.address}</p>
              <p className="text-base font-normal">
                {addressBookTableData?.city}
                <span>,</span>
                {addressBookTableData?.state} {addressBookTableData?.zip}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (paymentSelectedOptionData !== PAYMENTOPTIONS.CREDITCARD) {
    return null;
  }
  return (
    <div className="container mx-auto px-5 md:px-0">
      <div className="grid grid-cols-10 rounded-xl  border border-border-gray bg-white py-6 px-10">
        <div className="flex flex-col col-span-full gap-y-4 ">
          <h4 className="text-2xl">{Title?.value}</h4>

          <div className="mb-6 text-wrap w-1/2">
            <p className="text-base font-bold">{addressBookTableData?.companyName}</p>
            <p className="text-base font-normal">{addressBookTableData?.street}</p>
            <p className="text-base font-normal">{addressBookTableData?.address}</p>
            <p className="text-base font-normal">
              {addressBookTableData?.city}
              <span>,</span> {addressBookTableData?.state} {addressBookTableData?.zip}
            </p>
          </div>

          <CreditCardPayment />
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
