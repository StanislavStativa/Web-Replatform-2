import { KeyboardEvent, MouseEvent } from 'react';
import { Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { useAtom } from 'jotai';
import SecondaryNavigation from '../SecondaryNavigation/SecondaryNavigation';
import { type MenuItem, type INavMenuProps } from '../Header/Header.types';
import { cn } from '@/utils/cn';
import { selectedPrimaryNavigationId } from './atom';
import Link from '@/core/atoms/Link/Link';

const MenuItems: React.FC<INavMenuProps> = (props) => {
  const { menuItems, ariaLabel, className, ...rest } = props;

  const [primaryNavigationId, setPrimaryNavigationId] = useAtom(selectedPrimaryNavigationId);

  const onKeyDown = (itemId?: string) => (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.code === 'Enter' || event.keyCode === 40) {
      event.preventDefault();
      event.stopPropagation();
      setPrimaryNavigationId(itemId || '');
      setTimeout(() => {
        const secondaryEl = document.getElementById('navigation-mainSection') as HTMLElement;
        const firstChild = secondaryEl?.firstChild as HTMLElement;
        if (firstChild) {
          firstChild?.focus();
        }
      }, 125);
    }
  };

  const handleMenuItem = (event: MouseEvent<HTMLLIElement>) => {
    const el = event.target as HTMLElement;
    if (['a', 'img', 'button'].includes(el?.tagName?.toLowerCase())) {
      setPrimaryNavigationId('');
    }
    if (!el.dataset.item) return;
    if (el.dataset.item === primaryNavigationId) {
      setPrimaryNavigationId('');
    } else {
      setPrimaryNavigationId(el.dataset.item);
    }
  };

  const isPopUp = (item: MenuItem) => {
    if (item.fields.PopUpTitle || item.fields.PopupImage || item.fields.PopUpDescription)
      return true;
    return false;
  };

  return (
    <ul
      role="menubar"
      aria-label={ariaLabel}
      className={`flex items-center lg:gap-7 gap-3 w-full whitespace-nowrap ${className}`}
    >
      {(menuItems as MenuItem[])?.map(
        (item) =>
          !item?.fields?.HideInDesktop?.value && (
            <li
              key={item?.id}
              className={cn(
                'hover: cursor-pointer text-sm font-normal text-dark-gray py-4 w-auto',
                primaryNavigationId === item.id ? 'font-latoBold border-b-2 border-b-black' : ''
              )}
              tabIndex={0}
              data-item={item.id}
              onClick={handleMenuItem}
              onKeyDown={onKeyDown(item.id)}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded="false"
              data-type="primary-navigation-button"
            >
              {item?.fields?.ChildMenu?.length || item?.fields?.Image?.value || isPopUp(item) ? (
                <>
                  <Text field={item?.fields?.Title as TextField} />
                  {primaryNavigationId === item?.id && (
                    <div className="absolute top-full w-full right-0 font-latoRegular">
                      <SecondaryNavigation {...rest} />
                    </div>
                  )}
                </>
              ) : (
                <Link
                  field={item?.fields?.CTA}
                  className="text-sm text-dark-gray no-underline hover:font-normal hover:drop-shadow-none"
                />
              )}
            </li>
          )
      )}
    </ul>
  );
};
export default MenuItems;
