import React, { useMemo, KeyboardEvent, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { useAtom } from 'jotai';
import { PiCaretRight } from 'react-icons/pi';
import { IMainSectionProps } from './SecondaryNavigation.types';
import { selectedPrimaryNavigationId } from '../MainNavigation/atom';
import { selectedChildIdFromSecondaryNavigation, selectedSecondaryNavigationId } from './atoms';
import AnchorTag from '@/core/atoms/Anchor/AnchorTag';
import Link from '@/core/atoms/Link/Link';
import { MAINSECTION_INSPIRATION_BLOG } from '@/config';
import router from 'next/router';

const MainSection: React.FC<IMainSectionProps> = (props) => {
  const {
    rendering: { fields },
  } = props;

  const [primaryNavigationId] = useAtom(selectedPrimaryNavigationId);
  const [secondaryNavigationId, setSecondaryNavigationId] = useAtom(selectedSecondaryNavigationId);
  const [, setSelectedChildId] = useAtom(selectedChildIdFromSecondaryNavigation);

  const selectedMenu = useMemo(() => {
    if (!primaryNavigationId) return;
    const selectedValue = (fields.MainLeftNavigation || []).find((item) => {
      return item.id === primaryNavigationId;
    });
    if (selectedValue) return selectedValue;
    return (fields.MainRightNavigation || []).find((item) => {
      return item.id === primaryNavigationId;
    });
  }, [primaryNavigationId, fields.MainLeftNavigation, fields.MainRightNavigation]);

  const onMouseOver = (id: string) => () => {
    setSecondaryNavigationId(id);
    setSelectedChildId('');
  };

  const onKeyDown = (id: string) => (event: KeyboardEvent<HTMLDivElement>) => {
    if ([38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
      event.stopPropagation();
      const el = event.target as HTMLElement;
      switch (event.keyCode) {
        case 38:
          if (el.previousSibling) {
            const previousSibling = el.previousSibling as HTMLElement;
            el.tabIndex = -1;
            previousSibling.tabIndex = 0;
            previousSibling.focus();
          }
          break;
        case 39:
          setSecondaryNavigationId(id);
          setSelectedChildId('');
          setTimeout(() => {
            const secondaryEl = document.getElementById(
              'navigation-secondarySection'
            ) as HTMLElement;
            const firstChild = secondaryEl?.firstChild as HTMLElement;
            if (firstChild) {
              firstChild?.focus();
            }
          }, 125);
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

  useEffect(() => {
    setSecondaryNavigationId('');
  }, [router.asPath]);

  return (
    <div className="col-span-4 border-r">
      <div id="navigation-mainSection" className="flex flex-col">
        {selectedMenu?.fields?.ChildMenu?.map((item, index) => {
          if (!item?.fields?.Title?.value && !item?.fields?.CTA) return;
          const className = cn(
            'py-2 text-base no-underline text-dark-gray font-normal hover:font-latoBold hover:filter-none hover:text-black',
            secondaryNavigationId === item.id ? 'underline text-black font-latoBold' : ''
          );
          return (
            <div
              key={item.id}
              role="menuitem"
              tabIndex={index ? -1 : 0}
              className="flex items-center justify-between pr-10"
              onMouseOver={onMouseOver(item.id!)}
              onKeyDown={onKeyDown(item.id!)}
            >
              {item?.fields?.CTA?.value?.text === MAINSECTION_INSPIRATION_BLOG ? (
                <AnchorTag
                  href={item?.fields.CTA?.value?.href}
                  className="inline-flex items-center justify-center w-max h-max rounded-md hover:drop-shadow-button transition-all duration-100 ease-in-out hover:font-bold py-2 text-base font-normal hover:filter-none hover:text-black hover:underline text-dark-gray font-latoRegular"
                >
                  {item?.fields?.CTA?.value.text}
                </AnchorTag>
              ) : (
                <Link className={className} field={item?.fields?.CTA} role="none" tabIndex={-1} />
              )}

              {item?.fields?.ChildMenu?.length > 0 ? (
                <PiCaretRight
                  size={20}
                  color="#3D3935"
                  className={cn(secondaryNavigationId === item.id ? 'stroke-8 text-black' : '')}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainSection;
