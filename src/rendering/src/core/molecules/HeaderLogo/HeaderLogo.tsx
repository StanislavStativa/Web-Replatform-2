import { type HeaderLogoDesktopProps } from '../Header/Header.types';
import { isSearchBarOpen } from '../Header/Header';
import { useAtom } from 'jotai';
import Image from '@/core/atoms/Image/Image';
import AnchorTag from '@/core/atoms/Anchor/AnchorTag';

const HeaderLogo: React.FC<HeaderLogoDesktopProps> = ({ logo, mobileLogo }) => {
  const [isSearchOpen] = useAtom(isSearchBarOpen);
  return (
    <>
      {isSearchOpen ? null : (
        <AnchorTag
          href="/"
          className="md:hidden absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 hover:drop-shadow-none"
        >
          <Image
            field={
              mobileLogo && mobileLogo?.value?.src && mobileLogo?.value?.src?.length > 0
                ? mobileLogo
                : logo
            }
            priority={true}
          />
        </AnchorTag>
      )}

      <AnchorTag
        href="/"
        className="hidden lg:flex min-w-72  h-full md:absolute left-0 top-1/2 transform -translate-y-1/2 hover:drop-shadow-none"
      >
        <Image field={logo} priority={true} />
      </AnchorTag>
    </>
  );
};
export default HeaderLogo;
