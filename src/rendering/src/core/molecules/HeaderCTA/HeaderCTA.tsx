import { type CTAListProps } from '../Header/Header.types';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import { useAtom } from 'jotai';
import { isSearchBarOpen } from '../Header/Header';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useEffect, useRef, useState } from 'react';
import HeaderCTAOverlay from '../HeaderCTAOverlay/HeaderCTAOverlay';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import Close from '@/core/atoms/Icons/Close';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import cartAtom, { cartDetailAtom } from '@/core/cartStore/cartState';
import useCart from '@/hooks/useCart';
import { ComponentParams, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRouter } from 'next/navigation';
import { useRouter as useNavigation } from 'next/router';
import { CTAOverlayType } from '../HeaderCTAOverlay/HeaderCTAOverlay.type';
import Link from '@/core/atoms/Link/Link';
import { SIZE } from '@/utils/constants';
import Image from '@/core/atoms/Image/Image';
import { useEditor } from '@/hooks/useEditor';
import AnchorTag from '@/core/atoms/Anchor/AnchorTag';
import dynamic from 'next/dynamic';
import { ROUTES } from '@/utils/routes';

const CartHover = dynamic(() => import('../HeaderCTAOverlay/CartHover'), {
  ssr: false,
  loading: () => <></>,
});

interface HeaderCTAListProps {
  props: CTAListProps[];
  params: ComponentParams;
}

const HeaderCTA: React.FC<HeaderCTAListProps> = ({ props, params }) => {
  const deviceType = useDeviceType();
  const isMobile: boolean = deviceType === DeviceType.Mobile;
  const isTablet: boolean = deviceType === DeviceType.Tablet;
  const router = useRouter();
  const navigation = useNavigation();
  const { syncCart, getGuestCart, isCartListLoading } = useCart();
  const isEditing = useEditor();
  const [searchOpen] = useAtom(isSearchBarOpen);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [localCart] = useAtom(cartAtom);

  const [hasMounted, setHasMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cartHoverOpened, setIsCartHoverOpened] = useState<boolean>(false);
  const [totalItem, setTotalItem] = useState<number>(0);

  let syncFlag = true;

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasMounted && isAuthenticated && syncFlag && cartDetailState) {
      syncFlag = false;
      syncCart();
    }
  }, [isAuthenticated, cartDetailState, hasMounted]);
  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      getGuestCart();
    }
  }, [isAuthenticated, hasMounted]);
  useEffect(() => {
    if (isAuthenticated) {
      setTotalItem(
        cartDetailState
          ? cartDetailState?.CartItems?.LineItemCount + cartDetailState?.Samples?.LineItemCount
          : 0
      );
    } else if (!isAuthenticated && localCart && localCart?.length > 0) {
      setTotalItem(localCart?.length);
    } else {
      setTotalItem(0);
    }
  }, [cartDetailState, isAuthenticated, localCart, isCartListLoading]);

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsHovered(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      // Reset hover state when the route changes
      setIsHovered(false);
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
  }, [navigation.events]);

  if (!hasMounted) {
    return (
      <>
        <div className="lg:hidden w-full mx-auto flex justify-end">
          <div className="animate-pulse rounded-full bg-slate-200 h-6 w-6"></div>
        </div>
        <div className=" hidden lg:block p-3 max-w-247 w-full mx-auto">
          <div className="animate-pulse flex flex-row gap-7.6">
            <div className="flex flex-row gap-2 items-center">
              <div className="rounded-full bg-slate-200 h-5 w-5"></div>
              <div className="h-3 w-9 bg-slate-200 rounded"></div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="rounded-full bg-slate-200 h-5 w-5"></div>
              <div className="h-3 w-9 bg-slate-200 rounded"></div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="rounded-full bg-slate-200 h-5 w-5"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
  const handleCartHover = (href: string) => {
    if (isMobile || isTablet) {
      setIsCartHoverOpened(!cartHoverOpened);
    } else {
      router.push(href);
    }
  };
  const returnUrlRedirection = (href: string) => {
    const currentUrl = new URL(navigation?.asPath, location.origin);
    if (currentUrl?.pathname === ROUTES.EMAILSEARCH) {
      return;
    } else {
      const urlWithoutQuery = currentUrl?.pathname?.toLocaleLowerCase();
      const registerPaths =
        urlWithoutQuery.includes(ROUTES.REGISTERROUTE) ||
        urlWithoutQuery.includes(ROUTES.REGISTERCONFIRM) ||
        urlWithoutQuery.includes(ROUTES.FORGOTROUTE) ||
        urlWithoutQuery.includes(ROUTES.EMAILSEARCH);

      // Check if returnurl is already present in the URL
      const hasReturnUrl = currentUrl?.searchParams?.has('returnurl');

      if (!hasReturnUrl) {
        const returnurlValue = registerPaths ? ROUTES.MYACCOUNT : navigation.asPath;
        navigation.push(`${href}?returnurl=${returnurlValue}` || ROUTES.HOME);
      } else {
        navigation.push(href || ROUTES.HOME); // Redirect without adding returnurl again
      }
    }
  };

  return (
    <div className="md:flex gap-6.5 items-center" ref={listRef}>
      {props?.map((item) => {
        const shouldRenderLink =
          (isMobile || isTablet) &&
          (!searchOpen || isMobile || isTablet) &&
          item?.fields?.CTAType?.value === CTAOverlayType.Cart &&
          item?.fields?.Icon?.value?.src;

        const shouldRenderAuthorizedCTA =
          !isMobile &&
          !isTablet &&
          (isAuthenticated
            ? item?.fields?.CTAType?.value !== CTAOverlayType.SignIn
            : item?.fields?.CTAType?.value !== CTAOverlayType.MyAccount);

        if (
          ((isMobile || isTablet) && shouldRenderLink) ||
          (!(isMobile || isTablet) && shouldRenderAuthorizedCTA)
        ) {
          let iconComponent;
          if (item?.fields?.Icon?.value?.src) {
            if (item?.fields?.CTAType?.value === CTAOverlayType.Cart) {
              iconComponent =
                cartHoverOpened && isMobile ? (
                  <Close width={24} height={20} />
                ) : (
                  <button
                    className={`md:flex ${searchOpen && 'hidden'}`}
                    onClick={() => handleCartHover(item?.fields?.CTA?.value?.href ?? '')}
                  >
                    <Image priority={true} field={item?.fields?.Icon} />
                  </button>
                );
            } else {
              iconComponent = <Image priority={true} field={item?.fields?.Icon} />;
            }
          } else {
            iconComponent = null;
          }

          let cartItemCount;
          if (
            item?.fields?.CTAType.value === CTAOverlayType.Cart &&
            !cartHoverOpened &&
            totalItem > 0
          ) {
            cartItemCount = (
              <div className="relative bg-red-700 rounded-lg font-normal h-4 py-px px-1 text-sm text-white flex items-center -top-2 right-2">
                {totalItem}
              </div>
            );
          } else if (
            item?.fields?.CTAType.value === CTAOverlayType.Cart &&
            !cartHoverOpened &&
            isCartListLoading
          ) {
            cartItemCount = (
              <div className="relative -top-2 right-2">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-700"></span>
                </span>
              </div>
            );
          } else {
            cartItemCount = null;
          }

          return (
            <div
              key={item?.id}
              tabIndex={0}
              className={cn(
                'flex items-center w-max group',
                item?.fields?.CTAType?.value !== CTAOverlayType.Cart ? 'relative' : ''
              )}
              onMouseEnter={() => {
                if (item?.fields?.CTAType?.value === CTAOverlayType.SignIn) {
                  return;
                } else {
                  setIsHovered(true);
                }
              }}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                if (isMobile || isTablet) {
                  if (item?.fields?.CTAType?.value === CTAOverlayType.Cart) {
                    handleCartHover(item?.fields?.CTA?.value?.href ?? '');
                  } else {
                    router.replace(item?.fields?.CTA?.value?.href ?? '');
                  }
                }
              }}
            >
              {isEditing ? (
                <button
                  className="flex items-center gap-1  text-sm bg-transparent p-0 hover:no-underline hover:drop-shadow-none hover:font-normal no-underline"
                  style={{ filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))' }}
                >
                  {iconComponent}
                  {item?.fields?.CTAType?.value !== CTAOverlayType.Cart &&
                  item?.fields?.Title.value != '' ? (
                    <Text tag="h4" field={item?.fields?.Title} className="text-sm" />
                  ) : null}
                  {cartItemCount}
                </button>
              ) : item?.fields?.CTAType?.value === CTAOverlayType.FindAStore ? (
                <AnchorTag
                  href={item?.fields.CTA?.value.href}
                  className="flex items-center gap-1 text-sm bg-transparent p-0  hover:no-underline hover:drop-shadow-none hover:font-normal no-underline"
                >
                  <Image priority={true} field={item.fields.Icon} />
                  {item?.fields?.CTA?.value.text}
                </AnchorTag>
              ) : (
                <>
                  {item?.fields?.CTAType?.value === CTAOverlayType.SignIn ? (
                    <button
                      className="flex items-center gap-1 text-sm bg-transparent p-0  hover:no-underline hover:drop-shadow-none hover:font-normal no-underline"
                      style={{ filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))' }}
                      aria-label="button"
                      onClick={() => returnUrlRedirection(item?.fields?.CTA?.value?.href || '')}
                    >
                      {iconComponent}
                      {item?.fields?.CTAType?.value === CTAOverlayType.SignIn &&
                      item?.fields?.Title.value != '' ? (
                        <Text tag="h4" field={item?.fields?.Title} className="text-sm" />
                      ) : null}
                      {searchOpen && isMobile ? null : cartItemCount}
                    </button>
                  ) : (
                    <Link
                      className="flex items-center gap-1 text-sm bg-transparent p-0  hover:no-underline hover:drop-shadow-none hover:font-normal no-underline"
                      style={{ filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))' }}
                      field={item?.fields?.CTA}
                      size={params.size as SIZE}
                    >
                      {iconComponent}
                      {item?.fields?.CTAType?.value !== CTAOverlayType.Cart &&
                      item?.fields?.Title.value != '' ? (
                        <Text tag="h4" field={item?.fields?.Title} className="text-sm" />
                      ) : null}
                      {searchOpen && isMobile ? null : cartItemCount}
                    </Link>
                  )}
                </>
              )}
              {item?.fields && isHovered && (
                <HeaderCTAOverlay
                  fields={item?.fields}
                  className={cn('md:group-hover:visible invisible cursor-default')}
                />
              )}
              {cartHoverOpened ? (
                <div className="absolute top-51 right-0 bg-white md:hidden h-screen w-full">
                  <CartHover props={item?.fields} />
                </div>
              ) : null}
              <div className="hidden group-hover:visible">
                {isHovered &&
                  !isMobile &&
                  !isTablet &&
                  createPortal(
                    <div
                      className={cn('bg-black opacity-20 fixed top-0 bottom-0 w-full h-screen ', {
                        'hidden md:visible': cartHoverOpened,
                      })}
                    />,
                    document.body
                  )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default HeaderCTA;
