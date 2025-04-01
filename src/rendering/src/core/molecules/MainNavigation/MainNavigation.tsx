import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { type HeaderProps } from '../Header/Header.types';
import MenuItems from './MenuItems';
import { cn } from '@/utils/cn';
import { useAtom } from 'jotai';
import { selectedPrimaryNavigationId } from './atom';
import { isOverlayOpenState } from '../SearchBar/SearchBar';
import { useOnlyEditor } from '@/hooks/useEditor';

const MainNavigation: React.FC<HeaderProps> = (props) => {
  const isEditing = useOnlyEditor();
  const { MainLeftNavigation, MainRightNavigation } = props.rendering.fields;

  const [primaryNavigationId] = useAtom(selectedPrimaryNavigationId);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isSearchOverlayOpen] = useAtom(isOverlayOpenState);
  const [secondaryNavigationVisibility, toggleSecondaryNavigationVisibility] =
    useState<boolean>(true);

  useEffect(() => {
    const onScroll = () => {
      if (isEditing) return;
      const currentScrollPos = window.pageYOffset;
      toggleSecondaryNavigationVisibility(
        prevScrollPos > currentScrollPos || currentScrollPos < 10
      );
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [prevScrollPos, isEditing]);

  return (
    <div
      className={cn(
        'hidden lg:flex lg:px-10 transition-all duration-500 relative border-b border-tonal-gray bg-white container mx-auto ',
        primaryNavigationId || secondaryNavigationVisibility || isSearchOverlayOpen
          ? 'top-0 h-auto'
          : '-top-14 h-0 border-none'
      )}
    >
      <MenuItems ariaLabel="Main Left Nav" menuItems={MainLeftNavigation || []} {...props} />
      <MenuItems
        ariaLabel="Main Right Nav"
        menuItems={MainRightNavigation || []}
        className="flex justify-end"
        {...props}
      />
      {primaryNavigationId &&
        createPortal(
          <div className="bg-black opacity-50 fixed top-0 bottom-0 w-full h-screen" />,
          document.body
        )}
    </div>
  );
};
export default MainNavigation;
