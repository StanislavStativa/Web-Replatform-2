import { RichText, RichTextField, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { RxCaretLeft } from 'react-icons/rx';
import AccordianItem from '../Accordion/AccordionItem';
import AccordionSvg from '@/core/atoms/Icons/AccordionSvg';
import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';
import {
  type MobilenavigationProps,
  type NavigationAccordionProps,
} from './MobileNavigation.types';
import { type ChildMenuProps } from '../SecondaryNavigation/SecondaryNavigation.types';
import Link from '@/core/atoms/Link/Link';
import Image from '@/core/atoms/Image/Image';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';
import { useAtom } from 'jotai';
import { HamburgerMenuOpen } from '../HeaderCTA/HeaderCTAMobile';

export const ThirdMobileNavigation = (props: MobilenavigationProps) => {
  const { listData, setOpen, Title } = props;
  const { fields } = listData;
  const [, setHamburgerMenu] = useAtom(HamburgerMenuOpen);
  return (
    <div className="absolute top-0 left-0 bg-white h-screen pb-40 w-65 z-100">
      <div className="pb-48">
        <ul>
          <button className="p-5 flex items-center text-center" onClick={setOpen}>
            <RxCaretLeft className="font-normal text-base text-stone-700" size="1.5em" />
            <Text field={Title} tag="h2" className="text-base" />
          </button>
          <hr />
          <div className="px-6 py-3.5 flex flex-col gap-2">
            {fields?.Title?.value !== '' ? (
              <Text field={fields?.Title} className="text-base font-bold text-dark-gray" />
            ) : (
              <div className="text-base font-bold text-dark-gray">{fields.CTA.value.text}</div>
            )}
            <button onClick={() => setHamburgerMenu(false)} className="text-left">
              {' '}
              <Link className="text-sm font-normal no-underline" field={fields?.CTA}>
                {` View All
              ${fields?.Title?.value !== '' ? fields?.Title?.value : fields.CTA.value.text}`}
              </Link>
            </button>
          </div>
          <hr />
          {(fields?.ChildMenu as ChildMenuProps[]).map((item: ChildMenuProps) => {
            return (
              <li key={item?.id} className="flex flex-col ">
                <div className="flex flex-row bg-white text-dark-gray text-base gap-12 font-normal items-center justify-start py-2.5 pr-2 ">
                  <button className="w-full text-sm">
                    {item?.fields?.ChildMenu?.length ? (
                      <ThirdMenuAccordion
                        id={item.id}
                        fields={item.fields}
                        Title={item?.fields.Title}
                      />
                    ) : (
                      <div className="flex gap-2 pl-6 items-center">
                        <button
                          className="w-full flex items-center gap-3"
                          onClick={() => setHamburgerMenu(false)}
                        >
                          {item?.fields?.Icon?.value?.src && (
                            <Link field={item?.fields?.CTA} className="font-normal">
                              <Image desktopSrc={item?.fields?.Icon?.value?.src} alt="color" />
                            </Link>
                          )}

                          {item?.fields?.CTA?.value?.text ? (
                            <Link
                              field={item?.fields.CTA}
                              className="no-underline hover:font-normal text-left"
                            />
                          ) : (
                            <Text field={item?.fields?.Title} />
                          )}
                        </button>
                      </div>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const ThirdMenuAccordion: React.FC<NavigationAccordionProps> = ({
  id,
  fields,
  Title,
  isScroll,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [, setHamburgerMenu] = useAtom(HamburgerMenuOpen);
  const handleScrollToTop = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (expanded && isScroll) {
      accordionRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [expanded]);
  return (
    <div key={id} ref={accordionRef}>
      <Accordion type="single" collapsible className="w-full text-base no-decoration text-left">
        <AccordionItem value="item-1">
          <AccordionTrigger
            className="flex justify-between items-center py-3 px-6 text-sm font-normal text-dark-gray w-full hover:no-underline"
            onClick={() => handleScrollToTop()}
            id={`accordion-item-${id}`}
          >
            {(fields?.ChildMenu === undefined || fields?.ChildMenu === null) && (
              <>
                <Link field={fields?.CTA} href={fields?.CTA?.value?.href}>
                  {Title?.value !== '' ? <Text field={fields?.Title} /> : fields?.CTA.value.text}
                </Link>
              </>
            )}
            {(fields?.ChildMenu?.length || fields.Description) && (
              <>
                {Title?.value !== '' ? <Text field={fields?.Title} /> : fields?.CTA.value.text}
                <div>
                  <AccordionSvg expanded={expanded} />
                </div>
              </>
            )}
          </AccordionTrigger>
          <div
            className={cn(
              ' w-full bg-tonal-gray transition-all ease-in-out overflow-hidden duration-200 px-4'
            )}
          >
            <ul>
              {fields?.ChildMenu?.length
                ? fields?.ChildMenu?.map((item: ChildMenuProps) => {
                    return (
                      <AccordionContent key={item?.id} className={cn('font-bold text-base ')}>
                        <li key={item?.id} className="flex p-2 font-normal text-sm content-start">
                          {item?.fields?.CTA?.value?.text ? (
                            <button onClick={() => setHamburgerMenu(false)}>
                              <Link
                                field={item?.fields.CTA}
                                className="no-underline justify-left hover:text-normal"
                              />
                            </button>
                          ) : (
                            <Text field={item?.fields?.Title} />
                          )}
                        </li>
                      </AccordionContent>
                    );
                  })
                : null}
              {fields?.Description && (
                <AccordionContent className={cn('font-bold text-base ')}>
                  <RichText
                    field={fields?.Description as RichTextField}
                    className="text-sm font-normal py-6 leading-8"
                  />
                </AccordionContent>
              )}
            </ul>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordianItem;
