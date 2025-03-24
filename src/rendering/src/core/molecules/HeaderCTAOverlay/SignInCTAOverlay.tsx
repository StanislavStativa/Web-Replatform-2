import React from 'react';
import { type SignInOverlayProps } from './HeaderCTAOverlay.type';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import router from 'next/router';
import { ROUTES } from '@/utils/routes';

const SignInCTAOverlay: React.FC<SignInOverlayProps> = ({ props }) => {
  const { OverlayTitle, OverlayDescription, OverlayCTASize, OverlayCTAColor, OverlayCTA } = props;
  const returnUrlRedirection = (href: string) => {
    const currentUrl = new URL(router?.asPath, location.origin);
    if (currentUrl?.pathname === ROUTES.SIGNIN) {
      return;
    } else {
      const urlWithoutQuery = currentUrl?.pathname?.toLocaleLowerCase();
      const registerPaths =
        urlWithoutQuery.includes(ROUTES.REGISTERROUTE) ||
        urlWithoutQuery.includes(ROUTES.REGISTERCONFIRM) ||
        urlWithoutQuery.includes(ROUTES.FORGOTROUTE);

      // Check if returnurl is already present in the URL
      const hasReturnUrl = currentUrl?.searchParams?.has('returnurl');

      if (!hasReturnUrl) {
        const returnurlValue = registerPaths ? ROUTES.MYACCOUNT : router.asPath;
        router.push(`${href}?returnurl=${returnurlValue}` || ROUTES.HOME);
      } else {
        router.push(href || ROUTES.HOME); // Redirect without adding returnurl again
      }
    }
  };

  return (
    <>
      {OverlayTitle?.value !== '' && (
        <Text field={OverlayTitle} className=" font-latoLight pb-6 text-left " tag="h5" />
      )}
      {OverlayCTA?.value?.text && (
        <Button
          variant={OverlayCTAColor.value as ButtonVariant}
          size={OverlayCTASize.value as SIZE}
          className="text-sm leading-4 font-normal mb-2.5  text-center px-5 py-3  rounded-md w-full hover:font-latoBold"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            returnUrlRedirection(OverlayCTA?.value?.href || '');
          }}
        >
          {OverlayCTA?.value?.text}
        </Button>
      )}
      {OverlayDescription?.value !== '' && (
        <RichText
          field={OverlayDescription}
          className="w-full [&_a]:font-latoBold [&_a]:underline [&_a]:text-dark-gray  text-left  text-sm rte-signIn__overlay"
        />
      )}
    </>
  );
};

export default SignInCTAOverlay;
