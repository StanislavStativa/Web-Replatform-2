import HeaderCTA from '../HeaderCTA/HeaderCTA';
import HeaderCTAMobile from '../HeaderCTA/HeaderCTAMobile';
import SearchBar from '../SearchBar/SearchBar';
import { type HeaderProps } from './Header.types';
import { atom, useAtom } from 'jotai';
import HeaderLogo from '../HeaderLogo/HeaderLogo';
import { cn } from '@/utils/cn';
import Link from '@/core/atoms/Link/Link';
import { Image } from '@sitecore-jss/sitecore-jss-nextjs';
import MainNavigation from '../MainNavigation/MainNavigation';
import HeaderEventBar from './HeaderEventBar';
import { useEditor } from '@/hooks/useEditor';
export const isSearchBarOpen = atom<boolean>(false);
export const searchTerm = atom<string>('');

const Header: React.FC<HeaderProps> = (props) => {
  const id = props?.params?.RenderingIdentifier;
  const [isSearchOpen] = useAtom(isSearchBarOpen);
  const isEditing = useEditor();

  return (
    <div
      className={`w-full top-0 bg-white ${isEditing ? 'relative z-1' : 'fixed z-[9999998]'}`}
      role="navigation"
    >
      <HeaderEventBar {...props?.rendering?.fields} />
      <div className="container mx-auto md:px-10 bg-white">
        <nav
          aria-label="header"
          role="navigation"
          className={cn(
            ' relative flex p-2 md:gap-6 lg:pl-80 py-0 h-13 md:h-auto md:py-4 items-center justify-between z-50 w-full pr-7 pl-7 bg-white',
            {
              'gap-6': !isSearchOpen,
            }
          )}
          id={id}
        >
          <HeaderLogo
            logo={props?.rendering?.fields?.DesktopLogo}
            mobileLogo={props?.rendering?.fields?.MobileLogo}
          />
          <div
            className={cn('flex items-center gap-2 md:gap-8 lg:gap-0 w-fit md:w-full', {
              'w-full': isSearchOpen,
            })}
          >
            <HeaderCTAMobile props={props} />
            <div className="hidden md:flex  ">
              <Link field={{ href: '/' }} editable={false} className="lg:hidden  ">
                <Image
                  field={
                    props?.rendering?.fields?.MobileLogo.value?.src ??
                    props?.rendering?.fields?.MobileLogo.value?.src
                      ? props?.rendering?.fields?.MobileLogo
                      : props?.rendering?.fields?.DesktopLogo
                  }
                />
              </Link>
            </div>
            <SearchBar {...props?.rendering?.fields?.SearchBar} />
          </div>
          <HeaderCTA props={props?.rendering?.fields?.CTAList} params={props?.rendering?.params} />
        </nav>
      </div>
      <div className="border-b border-tonal-gray container mx-auto"></div>
      <MainNavigation {...props} />
    </div>
  );
};

export default Header;
