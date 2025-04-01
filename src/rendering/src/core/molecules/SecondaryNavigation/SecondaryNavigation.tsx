import { type ISecondaryNavigationProps } from './SecondaryNavigation.types';
import { useAtom } from 'jotai';
import MainSection from './mainSection';
import SecondarySection from './secondarySection';
import ThirdSection from './ThirdSection';
import { useMemo } from 'react';
import FlyoutComponent from './FlyoutComponent';
import { selectedChildIdFromSecondaryNavigation, selectedSecondaryNavigationId } from './atoms';
import useNavigationClickOutside from './useNavigationClickOutside';
import { selectedPrimaryNavigationId } from '../MainNavigation/atom';

const SecondaryNavigation: React.FC<ISecondaryNavigationProps> = (props) => {
  const {
    rendering: { fields },
  } = props;

  const [primaryNavigationId, setPrimaryNavigationId] = useAtom(selectedPrimaryNavigationId);
  const [selectedChildId] = useAtom(selectedChildIdFromSecondaryNavigation);
  const [secondaryNavigationId] = useAtom(selectedSecondaryNavigationId);
  const onOutsideClick = () => {
    setPrimaryNavigationId('');
  };
  const navigationRef = useNavigationClickOutside(onOutsideClick);

  const primaryNavigationData = useMemo(() => {
    if (!primaryNavigationId) return;
    const selectedValue = (fields.MainLeftNavigation || []).find((item) => {
      return item.id === primaryNavigationId;
    });
    if (selectedValue) return selectedValue;
    return (fields.MainRightNavigation || []).find((item) => {
      return item.id === primaryNavigationId;
    });
  }, [primaryNavigationId, fields.MainLeftNavigation, fields.MainRightNavigation]);

  const secondaryNavigationData = useMemo(() => {
    if (!secondaryNavigationId || !primaryNavigationData) return;
    return (primaryNavigationData.fields?.ChildMenu || []).find(
      (item) => item.id === secondaryNavigationId
    );
  }, [primaryNavigationData, secondaryNavigationId]);

  return (
    <div className="w-800 bg-white m-auto rounded-b-lg border-t border-tonal-gray shadow-header-overlay whitespace-normal text-shadow-[none]">
      <div ref={navigationRef}>
        {primaryNavigationData?.fields.NavigationType?.name === 'PopUp' ? (
          <FlyoutComponent {...props} primaryNavigationData={primaryNavigationData} />
        ) : (
          <div className="p-10 grid grid-cols-12 gap-10">
            <MainSection {...props} primaryNavigationData={primaryNavigationData} />
            <SecondarySection
              {...props}
              primaryNavigationData={primaryNavigationData}
              secondaryNavigationData={secondaryNavigationData}
            />
            {selectedChildId && (
              <ThirdSection {...props} secondaryNavigationData={secondaryNavigationData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryNavigation;
