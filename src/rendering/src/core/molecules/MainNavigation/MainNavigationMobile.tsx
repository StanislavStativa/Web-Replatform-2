import { Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { RxCaretRight } from 'react-icons/rx';
import RightNavigationSectionMobile from './RightNavigationSectionMobile';
import { SecondMobileNavigation } from './SecondMobileNavigation';
import { useState } from 'react';
import {
  type ISecondaryNavigationProps,
  type Navigation,
} from '../SecondaryNavigation/SecondaryNavigation.types';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { HamburgerMenuOpen } from '../HeaderCTA/HeaderCTAMobile';

const MainNavigationMobile: React.FC<ISecondaryNavigationProps> = (props) => {
  const [, setHamburgerOpen] = useAtom(HamburgerMenuOpen);
  const [open, setOpen] = useState<boolean>(false);
  const [listData, setItemData] = useState<Navigation | undefined>();
  const router = useRouter();

  const isSetOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col lg:hidden pb-20">
      {!open && (
        <>
          <div>
            <ul className="py-5 w-full px-6">
              {(props?.rendering?.fields?.MainLeftNavigation as Navigation[]).map(
                (item: Navigation) => {
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item?.fields?.ChildMenu?.length > 0) {
                            setOpen(!open);
                            setItemData(item);
                          } else {
                            router.push(item?.fields?.CTA?.value?.href as string);
                            setHamburgerOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between py-2.5 text-sm font-normal text-dark-gray"
                      >
                        <Text field={item?.fields?.Title as TextField} />
                        {item?.fields?.ChildMenu?.length > 0 && (
                          <RxCaretRight size="1.5rem" className="text-stone-600" />
                        )}
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
          <hr />
          <RightNavigationSectionMobile {...props} />
        </>
      )}
      {open && (
        <div>
          <SecondMobileNavigation listData={listData as Navigation} setOpen={isSetOpen} />
        </div>
      )}
    </div>
  );
};
export default MainNavigationMobile;
