import React from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { CTAOverlayType, type IHeaderCTAOverlayProps } from './HeaderCTAOverlay.type';
import { SIZE } from '@/utils/constants';
import Button from '@/core/atoms/Button/Button';
import { type ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useRouter } from 'next/router';
import { useI18n } from 'next-localization';
import MyAccountHeader from './MyAccountHeader';
import CartHover from './CartHover';

const HeaderCTAOverlay = (props: IHeaderCTAOverlayProps) => {
  const { OverlayCTA, OverlayCTAColor, OverlayCTASize, OverlayDescription, OverlayTitle, CTAType } =
    props?.fields ?? {};

  const router = useRouter();
  const { t } = useI18n();
  let overlayWidth = 'w-96';

  const [findAStore, setFindAStore] = React.useState<{
    zipCode: string;
    city: string;
    state: string;
  }>({ zipCode: '', city: '', state: '' });

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFindAStore({ ...findAStore, [e.target.name]: e.target.value });
  };

  const ValidateErrorMessage = () => {
    if (!findAStore?.zipCode && !findAStore?.city && !findAStore?.state)
      alert(t('FindStore_RequiredMessage'));
    if (!findAStore?.city && findAStore?.state) alert(t('Error_Please_Enter_City'));
    if (findAStore?.city && !findAStore?.state) alert(t('Error_Please_Enter_State'));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (findAStore.zipCode) {
      {
        if (OverlayCTA?.value?.href !== '')
          router
            .push(`${OverlayCTA?.value?.href}?near_location=${findAStore?.zipCode}`)
            .then(() => {
              window.location.reload();
            });
      }
    } else if (findAStore?.city && findAStore?.state) {
      {
        if (OverlayCTA?.value?.href !== '')
          router
            .push(
              `${OverlayCTA?.value?.href}?near_location=${findAStore?.city}, ${findAStore?.state}`
            )
            .then(() => {
              window.location.reload();
            });
      }
    } else {
      ValidateErrorMessage();
    }
  };

  let CTAVarient: JSX.Element = <></>;
  if (CTAType?.value === 'FindAStore') {
    CTAVarient = (
      <>
        {OverlayTitle?.value !== '' && (
          <Text
            field={OverlayTitle}
            className="ml-0.5 text-2xl font-normal pb-6 text-left"
            tag="h2"
          />
        )}
        <input
          name="zipCode"
          type="text"
          placeholder={t('FormLabels_Zipcode')}
          className="border border-dark-gray w-full rounded-lg text-sm font-normal mb-2.5 text-start px-6 py-3 focus:shadow-cyanBlue  focus-visible:outline-none"
          onChange={handleClick}
          autoComplete="off"
        />
        <div className="text-center mb-2.5 ml-0.5 text-xs font-normal">OR</div>
        <div className="flex">
          <input
            name="city"
            type="text"
            placeholder={t('FormLabels_City')}
            className=" border border-dark-gray font-normal text-sm mb-2.5 mr-1 px-6 py-3 text-start rounded-lg focus:shadow-cyanBlue  focus-visible:outline-none"
            onChange={handleClick}
            autoComplete="off"
          />
          <input
            name="state"
            type="text"
            placeholder={t('FormLabels_State')}
            className="w-1/2 border border-dark-gray px-6 py-3 text-start mb-2.5 ml-3.5 font-normal text-sm rounded-lg focus:shadow-cyanBlue focus-visible:outline-none"
            onChange={handleClick}
            autoComplete="off"
          />
        </div>
        {OverlayCTA?.value?.text && (
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSubmit(e)}
            variant={OverlayCTAColor.value as ButtonVariant}
            size={OverlayCTASize.value as SIZE}
            className="text-sm leading-4 font-normal mt-2.5 text-center px-6 py-3 ml-1 rounded-md w-full hover:font-latoBold"
          >
            {OverlayCTA?.value?.text}
          </Button>
        )}
        <hr className="border-1 border-gray-300 my-3" />
        {OverlayDescription?.value !== '' && (
          <RichText
            field={OverlayDescription}
            className="[&_strong]:!text-2xl [&_strong]:!font-normal [&_a]:!text-base [&_a]:!font-latoBold hover:[&_a]:underline hover:[&_a]:underline-offset-2 text-left w-fit text-base [&>p]:!flex [&>p]:!flex-col  [&>p]:!gap-2.5 [&_a]:!mb-1 "
          />
        )}
      </>
    );
  } else if (CTAType?.value === CTAOverlayType.MyAccount) {
    overlayWidth = 'w-44';
    CTAVarient = <MyAccountHeader props={props?.fields?.OverlayLinks} />;
  } else if (CTAType?.value === CTAOverlayType.Cart) {
    CTAVarient = <CartHover props={props?.fields} />;
  }

  return (
    <>
      {CTAType?.value && CTAType?.value !== CTAOverlayType?.SignIn && (
        <div
          className={cn('absolute top-5 right-[-2px]', props?.className, overlayWidth, {
            'top-4 md:top-9 w-full md:w-466 fixed md:absolute md:max-h-500':
              CTAType?.value === 'Cart',
          })}
        >
          <div
            className={cn(
              'mt-9 bg-white w-full md:before:w-4 md:before:h-4 shadow-ctaOverlay before:bg-white before:absolute before:top-7 p-6 before:right-14 before:rotate-45 border border-1 rounded-lg',
              {
                'p-0 cursor-pointer before:right-8': CTAType?.value === 'Cart',
              }
            )}
          >
            {CTAVarient}
          </div>
        </div>
      )}
    </>
  );
};
export default HeaderCTAOverlay;
