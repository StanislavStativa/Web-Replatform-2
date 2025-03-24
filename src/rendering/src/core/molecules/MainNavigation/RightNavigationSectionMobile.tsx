import { ThirdMenuAccordion } from './ThirdMobileNavigation';
import {
  ISecondaryNavigationProps,
  Navigation,
} from '../SecondaryNavigation/SecondaryNavigation.types';

const RightNavigationSectionMobile: React.FC<ISecondaryNavigationProps> = (props) => {
  const { MainRightNavigation } = props.rendering.fields;
  return (
    <div>
      <ul className="mt-5 w-full pb-32 ">
        {MainRightNavigation &&
          (MainRightNavigation as Navigation[]).map((item: Navigation) => {
            return (
              <li key={item.id}>
                <ThirdMenuAccordion
                  id={item.id}
                  fields={item?.fields}
                  Title={item?.fields?.Title}
                  isScroll={true}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default RightNavigationSectionMobile;
