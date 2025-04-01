import React, { memo, useEffect, useState } from 'react';
import { ITypesCompanyColData, ITypesCompanyUserList } from './CompanyUserList.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService';
import Image from '@/core/atoms/Image/Image';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import { useI18n } from 'next-localization';
import Table from '@/core/atoms/Table/Table';
import { useRouter } from 'next/router';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import useLocalStorage from '@/utils/useLocalStorage';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
const CompanyUserList = (props: ITypesCompanyUserList) => {
  const router = useRouter();
  const { t } = useI18n();
  const { Title, Icon } = props?.rendering?.fields;
  const { uid } = props?.rendering;
  const { HeadingTag } = props?.params;
  const queryClient = useQueryClient();
  const { setData } = useLocalStorage();
  const [companyUserList, setCompanyUserList] = useState([]);
  const [isEditForm, setIsEditForm] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const columns: ITypesTable<ITypesCompanyColData>['columns'] = [
    { header: t('CompanyUserList_EmailAddress'), accessor: 'email' },
    { header: t('CompanyUserList_FirstName'), accessor: 'firstName' },
    { header: t('CompanyUserList_LastName'), accessor: 'lastName' },
    { header: t('CompanyUserList_LastLoginDate'), accessor: 'lastLogin' },
    { header: t('CompanyUserList_LoginCounter'), accessor: 'loginCounter' },
  ];
  const {
    data: companyUserData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['getCompanyUserData'],
    queryFn: () => {
      return UserService.userGetCustomerUserList();
    },
  });

  const { mutate: lockUser, isPending: isLockPending } = useMutation({
    mutationFn: async (email: string) => {
      return await UserService.userLockUser(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`getCompanyUserData`] });
    },
    onError: () => {
      setShowError(true);
    },
  });
  const { mutate: unlLockUser, isPending: isUnLockPending } = useMutation({
    mutationFn: async (email: string) => {
      return await UserService.userUnlockUser(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`getCompanyUserData`] });
    },
    onError: () => {
      setShowError(true);
    },
  });

  const { mutate: deleteUser, isPending: isDeletePending } = useMutation({
    mutationFn: async (email: string) => {
      return await UserService.userDeleteUser(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`getCompanyUserData`] });
    },
    onError: () => {
      setShowError(true);
    },
  });

  const handleLock = (id: string, isLocked: boolean) => {
    setShowError(false);
    if (isLocked) {
      unlLockUser(id);
    } else {
      lockUser(id);
    }
  };
  const handleDelete = (id: string) => {
    setShowError(false);
    deleteUser(id);
  };

  const viewEditUser = (id: string) => {
    setShowError(false);
    const isEdit = id ? 'true' : 'false';
    const getUserDetails = companyUserList?.filter(
      (item: {
        email: string;
        firstName: string;
        lastName: string;
        lastLogin: string;
        countLogins: string;
        isDeletable?: boolean;
        isLockable?: boolean;
        isLocked?: boolean;
        phone?: string;
      }) => item?.email === id
    );
    const detailsVal = getUserDetails?.[0];

    setData('editUser', detailsVal);

    const queryParams = { ...router.query, isEditUser: isEdit };

    router.push(
      {
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  };
  useEffect(() => {
    if (companyUserData && companyUserData?.length > 0) {
      const modifiedData = companyUserData?.map(
        (item: {
          email: string;
          firstName: string;
          lastName: string;
          lastLogin: string;
          countLogins: string;
          isDeletable?: boolean;
          isLockable?: boolean;
          isLocked?: boolean;
          phone?: string;
        }) => {
          return {
            email: item.email,
            firstName: item?.firstName,
            lastName: item?.lastName,
            lastLogin: item?.lastLogin,
            loginCounter: item?.countLogins,
            id: item?.email,
            isDeletable: item?.isDeletable,
            isLockable: item?.isLockable,
            isLocked: item?.isLocked,
            phone: item?.phone,
          };
        }
      );
      setCompanyUserList(modifiedData);
    } else {
      setCompanyUserList([]);
    }
  }, [companyUserData]);

  useEffect(() => {
    if (router?.query?.isEditUser && router?.query?.isEditUser !== '') {
      refetch();
      setIsEditForm(true);
    } else {
      refetch();
      setIsEditForm(false);
    }
  }, [router?.query?.isEditUser]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
      }, 4000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError]);
  return (
    <>
      {isEditForm === false && (
        <section key={uid} className="pb-17 md:mb-10 md:py-14 container mx-auto px-4">
          {showError && <NotificationMessage isCloseable onCancel={() => setShowError(false)} />}
          {(isLoading || isLockPending || isDeletePending || isUnLockPending) && <LoaderSpinner />}
          <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-10">
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
                </div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
              <Table
                data={companyUserList}
                columns={columns}
                sortable
                isOnlyDelete
                isAction
                isActionLabel={t('CompanyUserList_Functions')}
                isClickableUnderLine
                isLock
                onEdit={handleLock}
                onDelete={handleDelete}
                clickableColumns={['email']}
                onCellClick={viewEditUser}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default memo(CompanyUserList);
