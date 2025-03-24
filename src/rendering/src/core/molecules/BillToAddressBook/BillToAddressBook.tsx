import { Text } from '@sitecore-jss/sitecore-jss-nextjs';

import { SIZE } from '@/utils/constants';

import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';

import Image from '@/core/atoms/Image/Image';
import Table from '@/core/atoms/Table/Table';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressService } from '@/api/services/AddressService';
import {
  ITypesAddressBookData,
  ITypesGetAddressDetails,
  BillToAddressBookProps,
} from './BillToAddressBook.types';
import Pagination from '@/core/atoms/Pagination/Pagination';
import { addressBookTablePageList } from '@/utils/constants';
import { useI18n } from 'next-localization';
import BillToAddressForm from './BillAddressForm/BillToAddressForm';
import { ITypesStateData } from './BillAddressForm/BillAddressForm.type';
import { useRouter } from 'next/router';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
const BillToAddressBook = (props: BillToAddressBookProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const { Title, Icon, IsBilling, IsShipping, StatesList } = props?.rendering?.fields;
  const { CTAColor, CTASize, HeadingTag } = props?.params;
  const queryClient = useQueryClient();
  const [isForm, setIsForm] = useState<boolean>(false);
  const [addressBookTableData, setAddressBookTableData] = useState<ITypesAddressBookData[]>([]);
  const [pageSize, setPageSize] = useState<number | undefined>(25);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedIdToPreview, setSelectedIdToPreview] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const { data: addressBookData, isLoading } = useQuery({
    queryKey: ['getAddressBookData', pageSize, router.pathname],
    queryFn: () => {
      return AddressService.addressGetAddresses(pageSize, IsShipping?.value, IsBilling?.value);
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (addressId: string) => {
      return await AddressService.addressDeleteAddress(addressId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`getAddressBookData`, pageSize] });
    },
    onError: () => {
      setShowError(true);
    },
  });

  const columns: ITypesTable<ITypesAddressBookData>['columns'] = [
    { header: t('AddressBook_Name'), accessor: 'name' },
    { header: t('AddressBook_Street'), accessor: 'street' },
    { header: t('AddressBook_Address2'), accessor: 'address' },
    { header: t('AddressBook_PostalCode'), accessor: 'zip' },
    { header: t('AddressBook_City'), accessor: 'city' },
  ];

  const handleSelectingPageSize = useCallback((currentPageSize: number | undefined) => {
    setPageSize(currentPageSize);
  }, []);

  const toggleAddForm = () => {
    setIsForm((prev: boolean) => !prev);
    setIsAddNew(true);
    setIsEdit(true);
    setSelectedIdToPreview(null);
  };
  const viewAddressDetails = (id: string) => {
    setIsEdit(false);
    setIsAddNew(false);
    setSelectedIdToPreview(id);
    setIsForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    mutate(id);
  };

  const handleEditAddress = (id: string) => {
    setIsEdit(true);
    setIsAddNew(false);
    setSelectedIdToPreview(id);
    setIsForm(true);
  };
  useEffect(() => {
    if (addressBookData && addressBookData?.length > 0) {
      const modifiedAddressBook = addressBookData?.map((item: ITypesGetAddressDetails) => {
        return {
          name: (
            <p className="w-32 break-words text-wrap text-right md:text-left">{item.CompanyName}</p>
          ),
          street: (
            <p className="w-32 break-words text-wrap text-right md:text-left">{item?.Street1}</p>
          ),
          address: (
            <p className="w-32 break-words text-wrap text-right md:text-left">{item?.Street2}</p>
          ),
          zip: item?.Zip,
          city: item?.City,
          id: item?.ID,
          isDeletable: true,
        };
      });
      setAddressBookTableData(modifiedAddressBook);
    } else {
      setAddressBookTableData([]);
    }
  }, [addressBookData]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError]);

  return (
    <div className="py-8 container mx-auto px-4">
      {isLoading && <LoaderSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-16 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-10">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <div className="w-full">
            <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
              <div className="flex md:items-center items-start">
                <div className="hidden md:block w-11 h-11 mr-8">
                  <Image field={Icon} />
                </div>
                <Text
                  tag={HeadingTag || 'h2'}
                  className="text-left text-xl font-semibold"
                  field={Title}
                />
              </div>
              {isForm === false && (
                <div className="flex w-full md:w-auto">
                  <Button
                    variant={CTAColor as ButtonVariant}
                    size={CTASize as SIZE}
                    isTypeSubmit={false}
                    className="w-full"
                    onClick={toggleAddForm}
                    isCTATextInCaps={props?.params?.IsCTATextInCaps}
                  >
                    <p className="text-sm">{t('AddressBook_AddAddressCTA')}</p>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isForm ? (
          <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
            <BillToAddressForm
              isEdit={isEdit}
              handleBack={toggleAddForm}
              stateData={StatesList as Array<ITypesStateData>}
              selectedIdToPreview={selectedIdToPreview}
              isAddNew={isAddNew}
              isBilling={IsBilling?.value}
              isShipping={IsShipping?.value}
            />
          </div>
        ) : (
          <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
            {showError && <NotificationMessage isCloseable onCancel={() => setShowError(false)} />}
            <Table
              data={addressBookTableData}
              columns={columns}
              sortable
              clickableColumns={['name']}
              onCellClick={viewAddressDetails}
              onDelete={handleDeleteAddress}
              onEdit={handleEditAddress}
            />
            <Pagination
              perPageList={addressBookTablePageList}
              currentPageSize={pageSize?.toString() || '25'}
              getSelectedPageSize={handleSelectingPageSize}
              selectClass="md:justify-end justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BillToAddressBook;
