import React, { useState, useRef } from 'react';
import AccordionSection from './MobileAccordion/AccordionSection';
import SpecificationGrid from './MobileAccordion/SpecificationGrid';
import { type PDPInfoProps, type SpecificationsOBJ } from './PDPInfo.types';
import { RichText, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import Link from '@/core/atoms/Link/Link';
import { useI18n } from 'next-localization';

const PDPInfoMobile: React.FC<PDPInfoProps> = ({ data, fields }) => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const text: RichTextField = {
    value: data?.ProductDescription as string,
  };
  const handleAccordionToggle = (item: string) => {
    setExpanded(
      (prev) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item) // Remove item if already expanded
          : [...prev, item] // Add item if not expanded
    );
    setShowMore(false);
  };
  const imageUrl = fields?.Image?.value?.toString();
  const handleSeeMoreToggle = () => {
    setShowMore(!showMore);
  };
  const { t } = useI18n();

  return (
    <div className="w-full" ref={accordionRef}>
      <AccordionSection
        value="item-1"
        title="Description"
        content={
          <div className="text-base pb-10 pl-3">
            {text && <RichText className={cn('text-base', 'mb-6')} field={text} />}
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: fields?.Prop65Warning?.value }}
            />
            <div className="mt-2">
              {fields?.CTA && (
                <Link field={fields?.CTA} className="pt-2 underline cursor-pointer" />
              )}
            </div>
            <div className="flex flex-wrap gap-5  mt-12">
              {fields?.Image?.value && (
                <img alt="description" src={imageUrl} className="w-auto h-auto flex-1" />
              )}
              {fields?.VideoURL?.value && (
                <iframe
                  id="ytplayer"
                  width="100%"
                  allowFullScreen
                  height="auto"
                  title={'Video'}
                  className={'w-full aspect-video print:hidden  flex-1'}
                  src={`https://www.youtube.com/embed/${fields?.VideoURL.value}?autoplay=0&controls=1&rel=0`}
                ></iframe>
              )}
            </div>
          </div>
        }
        expanded={expanded}
        onToggle={handleAccordionToggle}
      />
      <AccordionSection
        value="item-2"
        title="Specifications"
        content={
          <div className="flex flex-col justify-center items-stretch gap-10 w-full">
            {Object.keys(data.Specifications).map(
              (keyValue, index) =>
                index === 0 && (
                  <SpecificationGrid
                    data={data?.Specifications.PDPInfo_Dimensions}
                    title={t(keyValue)}
                    key={keyValue}
                    isDocument={false}
                  />
                )
            )}
            {!showMore && (
              <button className="underline text-center" onClick={handleSeeMoreToggle}>
                See More
              </button>
            )}
            {showMore && (
              <>
                {Object.keys(data.Specifications).map(
                  (keyValue, index) =>
                    index !== 0 && (
                      <SpecificationGrid
                        data={data?.Specifications[keyValue as keyof SpecificationsOBJ]}
                        title={t(keyValue)}
                        key={keyValue}
                        isDocument={false}
                      />
                    )
                )}
              </>
            )}
          </div>
        }
        expanded={expanded}
        onToggle={handleAccordionToggle}
      />
      <AccordionSection
        value="item-3"
        title="Resources"
        content={<SpecificationGrid data={data.Documents} title="" isDocument />}
        expanded={expanded}
        onToggle={handleAccordionToggle}
      />
    </div>
  );
};

export default PDPInfoMobile;
