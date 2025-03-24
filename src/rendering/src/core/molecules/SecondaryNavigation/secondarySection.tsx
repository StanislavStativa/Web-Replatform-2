import { KeyboardEvent } from 'react';
import { useAtom } from 'jotai';
import Image from '@/core/atoms/Image/Image';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from '@/core/atoms/Link/Link';
import { cn } from '@/utils/cn';
import { PiCaretRight } from 'react-icons/pi';
import { ISecondarySectionProps } from './SecondaryNavigation.types';
import { selectedChildIdFromSecondaryNavigation, selectedSecondaryNavigationId } from './atoms';
// import SecondarySectionImageView from './secondarySectionImageView';
import dynamic from 'next/dynamic';

const SecondarySectionImageView = dynamic(() => import('./secondarySectionImageView'), {
  ssr: false,
  loading: () => <p></p>,
});
const SecondarySection: React.FC<ISecondarySectionProps> = (props) => {
  const { primaryNavigationData, secondaryNavigationData } = props;

  const [secondaryNavigationId] = useAtom(selectedSecondaryNavigationId);
  const [selectedChildId, setSelectedChildId] = useAtom(selectedChildIdFromSecondaryNavigation);

  // it will be rendered when the selected secondary navigation menu does not have any children or when the secondary navigation is not selected
  if (!secondaryNavigationId || !secondaryNavigationData?.fields.ChildMenu.length) {
    return (
      <SecondarySectionImageView
        primaryNavigationData={primaryNavigationData}
        secondaryNavigationData={secondaryNavigationData}
        key={Date.now()}
      />
    );
  }

  const onMouseOverOnSecondaryNavigationItem = (id: string) => () => {
    setSelectedChildId(id);
  };

  const onKeyDown = (id: string) => (event: KeyboardEvent<HTMLDivElement>) => {
    if ([37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
      event.stopPropagation();
      const el = event.target as HTMLElement;
      switch (event.keyCode) {
        case 37: {
          const mainEl = document.getElementById('navigation-mainSection') as HTMLElement;
          const firstChild = mainEl?.firstChild as HTMLElement;
          if (firstChild) {
            firstChild?.focus();
          }
          break;
        }
        case 38:
          if (el.previousSibling) {
            const previousSibling = el.previousSibling as HTMLElement;
            el.tabIndex = -1;
            previousSibling.tabIndex = 0;
            previousSibling.focus();
          }
          break;
        case 39:
          setSelectedChildId(id);
          setTimeout(() => {
            const secondaryEl = document.getElementById('navigation-thirdSection') as HTMLElement;
            const firstChild = secondaryEl?.firstChild as HTMLElement;
            if (firstChild) {
              firstChild?.focus();
            }
          }, 100);
          break;
        case 40:
          if (el.nextSibling) {
            const nextSibling = el.nextSibling as HTMLElement;
            el.tabIndex = -1;
            nextSibling.tabIndex = 0;
            nextSibling.focus();
          }
          break;
        default:
          break;
      }
    }
  };

  const isHoverItem = secondaryNavigationData?.fields?.ChildMenu[0]?.fields?.Icon?.value?.src;

  return (
    <div
      id="navigation-secondarySection"
      className={cn(
        isHoverItem
          ? 'border-none col-span-8 flex flex-col flex-wrap max-h-96'
          : 'col-span-4 border-r'
      )}
    >
      {secondaryNavigationData?.fields?.ChildMenu?.map((item) => {
        return (
          <div
            key={item.id}
            tabIndex={-1}
            role="menuitem"
            className={cn(isHoverItem ? 'w-42' : 'flex items-center justify-between pr-10')}
            onMouseOver={onMouseOverOnSecondaryNavigationItem(item.id!)}
            onKeyDown={onKeyDown(item.id!)}
          >
            <div
              className="flex text-dark-gray text-base font-normal items-center"
              tabIndex={-1}
              role="none"
            >
              {isHoverItem && (
                <div
                  tabIndex={-1}
                  role="none"
                  className={cn(
                    'py-2 flex items-center gap-2.5',
                    isHoverItem
                      ? 'gap-2.5 hover:font-latoBold transition ease-in-out delay-150 hover:translate-x-2 hover:scale-110 duration-300 w-42'
                      : '',
                    secondaryNavigationData?.fields?.CTA?.value?.text === 'Color'
                      ? ''
                      : 'transition ease-in-out delay-150 duration-300 hover:brightness-0'
                  )}
                >
                  <Link
                    field={item?.fields?.CTA}
                    className="font-normal hover:font-latoBold hover:text-black"
                    tabIndex={-1}
                    role="none"
                  >
                    <Image desktopSrc={item?.fields?.Icon?.value?.src} alt="color" />
                  </Link>
                  <Link
                    tabIndex={-1}
                    role="none"
                    className={cn(
                      'py-2 no-underline hover:font-latoBold hover:filter-none hover:text-black',
                      selectedChildId === item.id && !item?.fields?.Icon?.value?.src
                        ? 'underline text-black font-latoBold'
                        : ''
                    )}
                    field={item?.fields?.CTA}
                  />
                </div>
              )}
              {!isHoverItem && item?.fields?.Title?.value && (
                <Link
                  field={item?.fields?.CTA}
                  tabIndex={-1}
                  role="none"
                  className={cn(
                    'py-2 no-underline',
                    item?.fields?.Icon?.value?.src ? 'hover:no-underline' : '',
                    selectedChildId === item.id ? 'underline font-latoBold' : ''
                  )}
                >
                  <Text field={item?.fields?.Title} />
                </Link>
              )}
              {!isHoverItem && !item?.fields?.Title?.value && (
                <Link
                  tabIndex={-1}
                  role="none"
                  className={cn(
                    'py-2 no-underline hover:font-latoBold hover:filter-none hover:text-black',
                    selectedChildId === item.id && !item?.fields?.Icon?.value?.src
                      ? 'underline font-latoBold text-black'
                      : ''
                  )}
                  field={item?.fields?.CTA}
                />
              )}
            </div>
            {!isHoverItem && !!item?.fields?.ChildMenu?.length && (
              <PiCaretRight
                size={20}
                color="#3D3935"
                className={cn(selectedChildId === item.id ? 'stroke-8 text-black' : '')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SecondarySection;
