import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type RegisterProUserProps } from './RegisterProUser.types';
import RegisterProUserImage from './RegisterProUserImage';
import RegisterProUserForm from './RegisterProUserForm';
import RegisterProUserConformation from './RegisterProUserConfirmation';
import useLocalStorage from '@/utils/useLocalStorage';
import { useMutation } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService';
import { OCUserRequest } from '@/api/models/OCUserRequest';
import { CHECKBOOLEANTYPEFROMSTRING, PROACCOUNT } from '@/utils/constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { safeJsonParse } from '@/utils/safeJsonParse ';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { ProAccountUserInfo } from './RegisterProUser.schema';

const RegisterProUser: React.FC<RegisterProUserProps> = ({ rendering }) => {
  const {
    MainTitle,
    ConfirmRegistration,
    ConfirmTitle,
    PriorSubmissionMessage,
    RegistrationConfirmationLink,
    EmarsysDetails,
  } = rendering?.fields?.data?.datasource;
  const { HeadingTag } = rendering?.params;
  const {
    AddressFieldId,
    CityFieldId,
    CompanyNameFieldId,
    DaytimePhoneFieldId,
    EmailFieldId,
    FirstNameFieldId,
    LastNameFieldId,
    OptinId,
    SAPCustomerFieldId,
    StateFieldId,
    StoreFieldId,
    ZipCodeFieldId,
    SubmitAction,
    CustomerTypeFieldId,
  } = EmarsysDetails?.jsonValue?.fields ?? {};

  const [formSubmitedErrorMessage, setFormSubmitedErrorMessage] = useState(false);

  const { getData, removeData } = useLocalStorage();

  const fetchedUserDataFromLocalStorage = getData<ProAccountUserInfo>('userInfo');
  const emarsysFields = {
    submitAction: SubmitAction?.map((action) => {
      const submitActionValue =
        safeJsonParse(action?.fields?.EmarsysAdditionalProperty?.value) ?? {}; // Default to an empty object if parsing fails

      return {
        emarsysEventID: submitActionValue.EmarsysEventID,
        //  submitToEmailAddress: fetchedUserDataFromLocalStorage?.email,
      };
    }).filter((action) => action.emarsysEventID), // Filter out any undefined or null emarsysEventID
  };
  const router = useRouter();

  const confirmValue = router?.query?.confirm;

  const mutation = useMutation({
    mutationFn: (createUser: OCUserRequest) => {
      return UserService.userCreateCustomer(createUser);
    },
    onSuccess: (data) => {
      if (data) {
        setFormSubmitedErrorMessage(false);
        if (RegistrationConfirmationLink?.jsonValue?.value?.target !== '') {
          window.open(RegistrationConfirmationLink?.jsonValue?.value?.href as string, '_blank');
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { path, ...filteredQuery } = router?.query; // Remove 'path' from the query
          router.push({
            pathname: RegistrationConfirmationLink?.jsonValue?.value?.href as string,
            query: {
              ...filteredQuery,
              id: data?.ID,
            },
          });
        }
        removeData('userInfo');
        removeData('storeRegion');
        removeData('ttsTradeProfession');
      } else {
        setFormSubmitedErrorMessage(true);
      }
    },
    onError: () => {
      setFormSubmitedErrorMessage(true);
    },
  });

  const clearErrorMessage = () => {
    setFormSubmitedErrorMessage(false);
  };

  const handleConfirmedFormDataSubmit = () => {
    const profession = (getData<string>('ttsTradeProfession') ?? '')
      ?.toLowerCase()
      ?.split(/[\s-]/)[0];

    setFormSubmitedErrorMessage(false);
    mutation.mutate({
      password: fetchedUserDataFromLocalStorage?.password,
      firstName: fetchedUserDataFromLocalStorage?.firstName,
      lastName: fetchedUserDataFromLocalStorage?.lastName,
      email: fetchedUserDataFromLocalStorage?.email,
      phone: fetchedUserDataFromLocalStorage?.phone,
      addressLine1: fetchedUserDataFromLocalStorage?.addressLine1,
      addressLine2: fetchedUserDataFromLocalStorage?.addressLine2,
      city: fetchedUserDataFromLocalStorage?.city,
      state: fetchedUserDataFromLocalStorage?.state,
      zipCode: fetchedUserDataFromLocalStorage?.zipCode,
      country: PROACCOUNT.COUNTRY,
      preferredStore: fetchedUserDataFromLocalStorage?.preferredStore,
      preferredStoreID: fetchedUserDataFromLocalStorage?.preferredStoreID,
      companyName: fetchedUserDataFromLocalStorage?.companyName,
      tradeProfessions: fetchedUserDataFromLocalStorage?.tradeProfessions,
      customerType: profession,
      userType: PROACCOUNT.USERTYPE,
      isEmailOptIn: fetchedUserDataFromLocalStorage?.isEmailOptIn,
      existingCustomerId: fetchedUserDataFromLocalStorage?.existingCustomerId ?? '',
      emarsysFields: {
        submitAction: emarsysFields.submitAction,
        fieldMappings: {
          firstNameFieldId: FirstNameFieldId?.value,
          lastNameFieldId: LastNameFieldId?.value,
          emailFieldId: EmailFieldId?.value,
          daytimePhoneFieldId: DaytimePhoneFieldId?.value,
          zipCodeFieldId: ZipCodeFieldId?.value,
          optinId: OptinId?.value,
          companyNameFieldId: CompanyNameFieldId?.value,
          cityFieldId: CityFieldId?.value,
          addressFieldId: AddressFieldId?.value,
          sapCustomerFieldId: SAPCustomerFieldId?.value,
          storeFieldId: StoreFieldId?.value,
          stateFieldId: StateFieldId?.value,
          customerTypeFieldId: CustomerTypeFieldId?.value,
        },
      },
    });
  };

  const handleNavigateBack = () => {
    clearErrorMessage();
    router.back();
  };
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (formSubmitedErrorMessage) {
      timeoutId = setTimeout(() => {
        setFormSubmitedErrorMessage(false);
      }, 10000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [formSubmitedErrorMessage]);

  // If the confirm value isn't available yet, show a loading spinner
  if (!router.isReady) {
    return <div className="w-full h-full flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className=" container mx-auto md:flex justify-center ">
      {mutation?.isPending && <LoaderSpinner />}
      {confirmValue === CHECKBOOLEANTYPEFROMSTRING.TRUE ? (
        <div className="mx-5 md:mx-auto sm:mx-0 pt-8 pb-12 md:pt-12 md:pb-14">
          <RegisterProUserConformation
            personalUserData={getData<ProAccountUserInfo>('userInfo')}
            proUserStateNameData={getData<string>('selectedStateName')}
            proUserProfession={getData<string>('ttsTradeProfession')}
            PriorSubmissionMessage={PriorSubmissionMessage}
            ConfirmTitle={ConfirmTitle}
            ConfirmRegistration={ConfirmRegistration}
            handleConfirmSubmit={handleConfirmedFormDataSubmit}
            handleNavigateBack={handleNavigateBack}
            HeadingTag={HeadingTag}
            formSubmitedErrorMessage={formSubmitedErrorMessage}
          />
        </div>
      ) : (
        <div className="h-max flex flex-col gap-y-9 lg:gap-y-12 pt-7 pb-12 md:pt-8 md:pb-16">
          {MainTitle && (
            <div>
              <Text
                field={MainTitle}
                tag={HeadingTag || 'h2'}
                className="text-center text-2xl  md:text-5xl text-dark-gray md:lato-h1"
              />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
            <div className="hidden lg:block md:w-522">
              <RegisterProUserImage
                data={rendering?.fields?.data}
                clearErrorMessage={clearErrorMessage}
              />
            </div>
            <div className="md:w-522">
              <RegisterProUserForm
                data={rendering?.fields?.data}
                fetchedUserDataFromLocalStorage={fetchedUserDataFromLocalStorage}
                clearErrorMessage={clearErrorMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterProUser;
