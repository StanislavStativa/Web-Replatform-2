import { useMemo, KeyboardEvent } from 'react';
import { useAtom } from 'jotai';
import Link from '@/core/atoms/Link/Link';
import { IThirdSectionProps } from './SecondaryNavigation.types';
import { selectedChildIdFromSecondaryNavigation } from './atoms';

const ThirdSection: React.FC<IThirdSectionProps> = (props) => {
  const { secondaryNavigationData } = props;

  const [selectedChildId] = useAtom(selectedChildIdFromSecondaryNavigation);

  const selectedThirdData = useMemo(() => {
    return (secondaryNavigationData?.fields?.ChildMenu || []).find(
      (item) => item.id === selectedChildId
    );
  }, [secondaryNavigationData, selectedChildId]);

  if (!selectedThirdData?.fields.ChildMenu.length) {
    return null;
  }

  const onKeyDown = () => (event: KeyboardEvent<HTMLDivElement>) => {
    if ([37, 38, 40].includes(event.keyCode)) {
      event.preventDefault();
      event.stopPropagation();
      const el = event.target as HTMLElement;
      switch (event.keyCode) {
        case 37: {
          const secondaryEl = document.getElementById('navigation-secondarySection') as HTMLElement;
          const firstChild = secondaryEl?.firstChild as HTMLElement;
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

  return (
    <div id="navigation-thirdSection" className="col-span-4">
      {selectedThirdData?.fields.ChildMenu?.map((item) => {
        return (
          <div
            key={item.id}
            role="menuitem"
            tabIndex={-1}
            onKeyDown={onKeyDown()}
            className="flex items-center justify-between pr-10"
          >
            {item?.fields?.Title?.value && (
              <Link
                className="py-2 text-base no-underline hover:text-black hover:filter-none hover:font-latoBold hover:underline text-dark-gray font-normal"
                field={item?.fields?.CTA}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ThirdSection;
