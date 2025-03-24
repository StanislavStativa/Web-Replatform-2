import { useEffect, useState, useRef } from 'react';
import { CTAListProps, HeaderProps } from '../Header/Header.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Close from '@/core/atoms/Icons/Close';
import Hamburger from '@/core/atoms/Icons/Hamburger';
import Link from '@/core/atoms/Link/Link';
import MainNavigationMobile from '../MainNavigation/MainNavigationMobile';
import { createPortal } from 'react-dom';
import ScheduleFreeConsultationMobile from '../SecondaryNavigation/ScheduleFreeConsultationMobile';
import Image from '@/core/atoms/Image/Image';
import { atom, useAtom, useSetAtom } from 'jotai';
import { authorizationAtom } from '@/data/atoms/authorization';
import AccordionSvg from '@/core/atoms/Icons/AccordionSvg';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';
import { cn } from '@/utils/cn';
import { clearTokens, clearUserDetails } from '@/utils/authUtils';
import { useCartState } from '@/core/cartStore/useCartState';
import { useRouter } from 'next/navigation';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { useRouter as useNavigation } from 'next/router';
import Cookies from 'js-cookie';
import { IS_NET_PRO, IS_PROUSER } from '@/config';
import { PROTERMSOFPAYMENT } from '@/utils/constants';
interface HeaderCTAMobileProps {
  props: HeaderProps;
}
export const HamburgerMenuOpen = atom<boolean | undefined>(false);

const HeaderCTAMobile: React.FC<HeaderCTAMobileProps> = ({ props }) => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useAtom(HamburgerMenuOpen);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  // const [hasMounted, setHasMounted] = useState(false);
  const [, setHamburgerMenu] = useAtom(HamburgerMenuOpen);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const ntProUser = Cookies.get(IS_NET_PRO);
  const { removeCart } = useCartState();
  const setAuthorizationAtom = useSetAtom(authorizationAtom);
  const [, SetCartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [isNtPro, setIsNtPro] = useState<boolean>(false);
  const proTermsArray = [
    PROTERMSOFPAYMENT.NETTHIRTY,
    PROTERMSOFPAYMENT.NETFOURTYFIVE,
    PROTERMSOFPAYMENT.NETNINENTY,
  ];
  const handleScrollToTop = () => {
    setExpanded(!expanded);
  };
  const handleSignOut = (href: string) => {
    removeCart();
    clearTokens();

    clearUserDetails();
    SetCartDetailState(null);
    setAuthorizationAtom({ isAuthenticated: false, assignedRoles: [] });
    setTimeout(() => {
      router.replace(href);
    }, 300);
  };
  useEffect(() => {
    if (expanded) {
      accordionRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [expanded]);

  // useEffect(() => {
  //   setHasMounted(true);
  // }, [isAuthenticated]);

  useEffect(() => {
    const handleRouteChange = () => {
      // Reset hover state when the route changes
      setIsOpen(false);
    };

    // Listen for route change events
    navigation.events.on('routeChangeStart', handleRouteChange);
    navigation.events.on('routeChangeComplete', handleRouteChange);
    navigation.events.on('routeChangeError', handleRouteChange);

    return () => {
      // Cleanup event listeners
      navigation.events.off('routeChangeStart', handleRouteChange);
      navigation.events.off('routeChangeComplete', handleRouteChange);
      navigation.events.off('routeChangeError', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation.events]);

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

  // if (!hasMounted) {
  //   return null;
  // }

  const openHamburgerMenu = () => {
    setIsOpen(true);
    setExpanded(false);
  };

  const closeHamburgerMenu = () => {
    setIsOpen(false);
  };

  const renderCTALink = (item: CTAListProps) => {
    if (
      (isAuthenticated && item?.fields?.CTAType?.value === 'SignIn') ||
      (!isAuthenticated && item?.fields?.CTAType?.value === 'MyAccount')
    ) {
      return null;
    } else {
      let MobileSideBarCTAs: JSX.Element = <></>;
      if (item?.fields?.CTAType?.value !== 'MyAccount') {
        MobileSideBarCTAs = (
          <Link field={item?.fields?.CTA} onClick={closeHamburgerMenu}>
            <div className="flex text-base items-center gap-3.5 py-1.5 px-6">
              {item?.fields?.Icon?.value?.src ? <Image field={item?.fields?.Icon} /> : null}
              {item?.fields?.Title?.value !== '' ? (
                <Text tag="h4" field={item?.fields?.Title} className="text-sm" />
              ) : null}
            </div>
          </Link>
        );
      } else {
        MobileSideBarCTAs = (
          <div key={item?.id} ref={accordionRef}>
            <Accordion
              type="single"
              collapsible
              className="w-full text-base no-decoration text-left"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  className="flex justify-between items-center text-sm font-normal text-dark-gray w-full hover:no-underline"
                  onClick={() => handleScrollToTop()}
                  id={`accordion-item-${item?.id}`}
                >
                  <div className="w-full flex items-center gap-3.5 py-1.5 px-6">
                    {item?.fields?.Icon?.value?.src ? <Image field={item?.fields?.Icon} /> : null}
                    {item?.fields?.Title?.value !== '' ? (
                      <Text tag="h4" field={item?.fields?.Title} className="text-sm" />
                    ) : null}
                    {item.fields?.OverlayLinks?.length && (
                      <div className="ml-14">
                        <AccordionSvg expanded={expanded} />
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <div
                  className={cn(
                    ' w-full bg-[#EBEBEC] transition-all ease-in-out overflow-hidden duration-200 px-4'
                  )}
                >
                  <ul>
                    {item?.fields?.OverlayLinks?.length
                      ? item?.fields?.OverlayLinks?.map((linkItem) => {
                          let linkContent = null;

                          // Move the logic here to determine the content for the link
                          if (linkItem?.fields?.IsPaymentCTA?.value && isProUser && isNtPro) {
                            linkContent = (
                              <Link
                                field={linkItem?.fields?.CTA}
                                className="no-underline justify-left hover:text-normal pl-8"
                              />
                            );
                          } else if (
                            !linkItem?.fields?.IsPaymentCTA?.value &&
                            isProUser &&
                            linkItem?.fields?.IsVsibleOnlyForProUser?.value &&
                            !isNtPro
                          ) {
                            linkContent = (
                              <Link
                                field={linkItem?.fields?.CTA}
                                className="no-underline justify-left hover:text-normal pl-8"
                              />
                            );
                          } else if (
                            !linkItem?.fields?.IsPaymentCTA?.value &&
                            !linkItem?.fields?.IsVsibleOnlyForProUser?.value &&
                            !linkItem?.fields?.IsVsibleOnlyForNT30ProUser?.value
                          ) {
                            linkContent = (
                              <Link
                                field={linkItem?.fields?.CTA}
                                className="no-underline justify-left hover:text-normal pl-8"
                              />
                            );
                          }

                          // Only render AccordionContent if there's link content
                          return linkContent ? (
                            <AccordionContent
                              key={linkItem?.id}
                              className={cn('font-bold text-base py-5')}
                            >
                              <li
                                key={linkItem?.id}
                                className="flex px-2 font-normal text-sm content-start"
                              >
                                <button onClick={() => setHamburgerMenu(false)}>
                                  {linkItem?.fields?.IsSignOutCTA?.value ? (
                                    <button
                                      className="no-underline justify-left hover:text-normal pl-8"
                                      onClick={() => handleSignOut('/')}
                                    >
                                      {linkItem?.fields?.CTA?.value?.text}
                                    </button>
                                  ) : (
                                    linkContent
                                  )}
                                </button>
                              </li>
                            </AccordionContent>
                          ) : null;
                        })
                      : null}
                  </ul>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        );
      }
      return MobileSideBarCTAs;
    }
  };

  return (
    <div className="lg:hidden flex relative">
      {isOpen ? (
        <div className="w-4.5 h-4.5">
          <Close onClick={closeHamburgerMenu} width={18} height={18} />
        </div>
      ) : (
        <div className="w-4.5 h-4.5">
          <Hamburger width={18} height={18} onClick={openHamburgerMenu} />
        </div>
      )}

      {isOpen ? (
        <div className="z-50 absolute top-9  md:top-[2.90rem] -left-7 md:-left-[4.5rem] bg-white h-screen overflow-y-auto w-65 mobile-sidebar">
          <ScheduleFreeConsultationMobile {...props} />
          <div className="flex gap-1.5 justify-start flex-wrap py-2 flex-col">
            {props?.rendering?.fields?.CTAList?.sort((a, b) => {
              const typeA = a?.fields?.CTAType?.value?.toUpperCase();
              const typeB = b?.fields?.CTAType?.value?.toUpperCase();

              if (typeA < typeB) return 1;
              if (typeA > typeB) return -1;
              return 0;
            }).map((item) => {
              return (
                <div key={item?.id} className="flex items-center gap-2.5">
                  {item?.fields?.CTAType?.value !== 'Cart' ? renderCTALink(item) : null}
                </div>
              );
            })}
          </div>

          <hr />
          <MainNavigationMobile {...props} />
          {createPortal(
            <div
              onClick={closeHamburgerMenu}
              className="bg-black opacity-50 fixed top-0 bottom-0 w-full h-screen"
            />,
            document.body
          )}
        </div>
      ) : null}
    </div>
  );
};
export default HeaderCTAMobile;
