/**
 * A React component that renders a button with customizable styles.
 *
 * @param {AccordionSvgProps} props - The props for the svg component.
 * @returns {React.ReactElement} - The rendered accordion svg component.
 */

import { AccordionSvgProps } from '@/core/molecules/Accordion/Accordion.type';
import { cn } from '@/utils/cn';

const AccordionSvg = (props: AccordionSvgProps) => {
  const { expanded } = props;
  return (
    <svg
      role="presentation"
      className=" shrink-0 ml-8"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="7"
        width="16"
        height="2"
        rx="1"
        className={cn(
          'transform origin-center transition duration-300 ease-in-out',
          expanded && '!rotate-180'
        )}
      />
      <rect
        y="7"
        width="16"
        height="2"
        rx="1"
        className={cn(
          'transform origin-center rotate-90 transition duration-300 ease-in-out',
          expanded && '!rotate-180'
        )}
      />
    </svg>
  );
};

export default AccordionSvg;
