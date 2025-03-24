import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';
import AccordionSvg from '@/core/atoms/Icons/AccordionSvg';
import { type AccordionSectionProps } from '../PDPInfo.types';

const AccordionSection: React.FC<AccordionSectionProps> = ({
  value,
  title,
  content,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion type="multiple" value={expanded} className="w-full text-base text-left">
      <AccordionItem value={value}>
        <AccordionTrigger
          className="py-4 border-b border-light-gray flex justify-between items-center text-sm font-latoBold text-dark-gray w-full hover:no-underline"
          onClick={() => onToggle(value)}
        >
          <span className="text-lg font-latoBold">{title}</span>
          <AccordionSvg expanded={expanded.includes(value)} />
        </AccordionTrigger>
        <AccordionContent className="text-base py-6">
          {expanded.includes(value) && content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionSection;
