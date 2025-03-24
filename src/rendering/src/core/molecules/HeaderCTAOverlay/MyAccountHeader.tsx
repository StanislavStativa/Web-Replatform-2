import React, { useEffect, useState } from 'react';
import { type HeaderMyAccountProps } from './HeaderCTAOverlay.type';
import Link from '@/core/atoms/Link/Link';
import { clearTokens, clearUserDetails } from '@/utils/authUtils';
import { useRouter } from 'next/navigation';
import { useCartState } from '@/core/cartStore/useCartState';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useAtom, useSetAtom } from 'jotai';
import useCart from '@/hooks/useCart';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import Cookies from 'js-cookie';
import { IS_NET_PRO, IS_PROUSER } from 'src/config';
import { PROTERMSOFPAYMENT } from '@/utils/constants';

const MyAccountHeader: React.FC<HeaderMyAccountProps> = ({ props }) => {
  const router = useRouter();
  const { removeCart } = useCartState();
  const { refreshCart } = useCart();
  const ntProUser = Cookies.get(IS_NET_PRO);
  const setAuthorizationAtom = useSetAtom(authorizationAtom);
  const [, SetCartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [isNtPro, setIsNtPro] = useState<boolean>(false);
  const proTermsArray = [
    PROTERMSOFPAYMENT.NETTHIRTY,
    PROTERMSOFPAYMENT.NETFOURTYFIVE,
    PROTERMSOFPAYMENT.NETNINENTY,
  ];

  const handleSignOut = (href: string) => {
    clearTokens();
    removeCart();
    clearUserDetails();
    SetCartDetailState(null);
    setAuthorizationAtom({ isAuthenticated: false, assignedRoles: [] });
    refreshCart();
    setTimeout(() => {
      router.replace(href);
    }, 300);
  };
  useEffect(() => {
    const proUserCookie = Cookies.get(IS_PROUSER);
    if (proUserCookie !== undefined) setIsProUser(proUserCookie === 'true');
  });
  useEffect(() => {
    if (ntProUser && Object.values(proTermsArray).includes(ntProUser.trim() as PROTERMSOFPAYMENT)) {
      setIsNtPro(true);
    } else {
      setIsNtPro(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ntProUser]);
  return (
    <>
      {props
        ? props?.map((link) => (
            <div key={link?.id}>
              <ul className="m-0 font-normal text-sm leading-8">
                {link?.fields?.IsSignOutCTA?.value ? (
                  <li className="mb-2.5">
                    <button
                      className=" hover:underline cursor-pointer"
                      onClick={() => handleSignOut('/')}
                    >
                      {link?.fields?.CTA.value?.text}
                    </button>
                  </li>
                ) : (
                  <li className="mb-2.5">
                    {link?.fields?.IsPaymentCTA?.value && isProUser && isNtPro ? (
                      <Link
                        field={link?.fields?.CTA}
                        className="p-0 hover:underline cursor-pointer"
                      />
                    ) : !link?.fields?.IsPaymentCTA?.value &&
                      isProUser &&
                      link?.fields?.IsVsibleOnlyForProUser?.value &&
                      !isNtPro ? (
                      <Link
                        field={link?.fields?.CTA}
                        className="p-0 hover:underline cursor-pointer"
                      />
                    ) : !link?.fields?.IsPaymentCTA?.value &&
                      !link?.fields?.IsVsibleOnlyForProUser?.value &&
                      !link?.fields?.IsVsibleOnlyForNT30ProUser?.value ? (
                      <Link
                        field={link?.fields?.CTA}
                        className="p-0 hover:underline cursor-pointer"
                      />
                    ) : null}
                  </li>
                )}
              </ul>
            </div>
          ))
        : null}
    </>
  );
};

export default MyAccountHeader;
