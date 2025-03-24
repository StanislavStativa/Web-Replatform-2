/**
 * A React component that renders a Accordion Item.
 * @param {Accordion} props - The props for the Accordion component.
 * @returns {React.ReactElement} - The rendered Accordion component.
 */

import { useRef, useState } from 'react';
import { type AccordionItem } from './Accordion.type';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import AccordionSvg from '@/core/atoms/Icons/AccordionSvg';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import {
  Accordion,
  AccordionItem as AccordionData,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';

const AccordianItem: React.FC<AccordionItem> = ({ id, fields }) => {
  const openByDefault = fields?.OpenbyDefault?.value;
  const showBackToTop = fields?.BacktoTop?.value;
  const [expanded, setExpanded] = useState<boolean>(openByDefault);
  const accordionRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const handleScrollToTop = (): void => {
    if (accordionRef?.current) {
      const scrollOffset = -160;
      const scrollPosition =
        accordionRef.current.getBoundingClientRect().top + window.pageYOffset + scrollOffset;
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  };

  return (
    <div key={id} ref={accordionRef} className="mb-1">
      <Accordion type="single" collapsible className="w-full text-base no-decoration text-left ">
        <AccordionData value="item-1">
          <AccordionTrigger
            className="flex justify-between items-center border-b border-b-dark-gray border-opacity-35 py-3 w-full "
            onClick={() => setExpanded((prev) => !prev)}
          >
            <Text
              tag="h3"
              className={cn('text-left table-content', getHeadingStyles('h5', 'h5'))}
              field={fields?.Title}
              id={id ? id + 'table-content' : Math.random() + 'table-content'}
            />
            <AccordionSvg expanded={expanded} />
          </AccordionTrigger>
          <div
            className={cn(
              'leading-6 text-base  transition-all ease-in-out overflow-hidden duration-200 grid grid-cols-12',
              expanded ? 'h-auto py-13' : 'h-0'
            )}
          >
            <AccordionContent className="col-span-10">
              <RichText field={fields?.Description} />
              {showBackToTop && (
                <Button
                  aria-label="back-to-top"
                  className="col-span-10 px-0 inline-block mt-4 text-black underline font-bold text-opacity-65 text-base bg-transparent hover:bg-transparent underline-offset-4"
                  onClick={handleScrollToTop}
                >
                  {t('Labels_Backtotop')}
                </Button>
              )}
            </AccordionContent>
          </div>
        </AccordionData>
      </Accordion>
    </div>
  );
};

export default AccordianItem;
