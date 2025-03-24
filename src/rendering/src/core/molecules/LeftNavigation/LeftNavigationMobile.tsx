/**
 * Renders the mobile version of the left navigation component.
 * @param props - The props for the component.
 * @param props.isOpen - Whether the left navigation is currently open.
 * @param props.onClose - A callback function to close the left navigation.
 * @param props.children - The content to be rendered inside the left navigation.
 * @returns The rendered left navigation component.
 */

import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type LeftNavigationMobileProps, type LinkItemsProp } from './LeftNavigation.types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/core/atoms/ui/Accordion';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import Link from '@/core/atoms/Link/Link';

const LeftNavigationMobile: React.FC<LeftNavigationMobileProps> = ({
  CTA,
  Title,
  Links,
  HeadingTag,
}): JSX.Element => {
  const [isLeftNavigationOpen, setIsLeftNavigationOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<LinkItemsProp | null>(null);
  const [isAnimationOn, setIsAnimationOn] = useState<boolean>(false);

  const handleOpenLeftNavigation = (item: LinkItemsProp | null) => {
    setIsLeftNavigationOpen(true);
    setSelectedItem(item);
    setIsAnimationOn(true);
  };

  const handleCloseLeftNavigation = () => {
    setTimeout(() => {
      setIsLeftNavigationOpen(false);
      setSelectedItem(null);
    }, 150);
    setIsAnimationOn(false);
  };

  return (
    <div className="flex md:hidden w-full overflow-hidden text-sm">
      <Accordion type="single" collapsible className="w-full text-base no-decoration text-left">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex border-b w-full text-base hover:no-underline px-3.6 py-2.8">
            <div className="flex align-center justify-between w-full">
              {CTA?.jsonValue?.value ? (
                <div className="no-underline m-0  text-xl text-dark-gray font-semibold">
                  {CTA?.jsonValue?.value?.text}
                </div>
              ) : (
                <Text
                  field={Title}
                  tag={HeadingTag || 'h2'}
                  className="mb-4 hover:font-bold cursor-pointer text-dark-gray font-semibold"
                />
              )}
            </div>
            <IoIosArrowForward className="w-5 h-5 font-normal text-dark-gray" />
          </AccordionTrigger>
          {isLeftNavigationOpen ? (
            <AccordionContent
              className={cn('pb-0', {
                'animate-slideLeft': isAnimationOn,
                'animate-slideRight': !isAnimationOn,
                'min-h-48': selectedItem && selectedItem?.SecondaryLinks?.targetItems.length,
              })}
            >
              <button
                className={`flex items-center w-full text-black text-sm py-2.5 pr-5 ${selectedItem && selectedItem?.SecondaryLinks?.targetItems.length > 0 ? 'border-b' : ''}`}
                onClick={() => handleCloseLeftNavigation()}
              >
                <IoIosArrowBack className="h-5 w-5 font-normal ml-[-5px]" />
                <p className="mb-0 font-normal cursor-pointer text-base hover:drop-shadow-button pl-4">
                  {selectedItem?.Title?.value
                    ? selectedItem?.Title?.value
                    : selectedItem?.CTA?.jsonValue?.value?.text}
                </p>
              </button>
              {selectedItem?.SecondaryLinks?.targetItems?.map((secondaryItem) => {
                return (
                  <div key={`primary_item_${secondaryItem?.CTA?.jsonValue?.value?.id}`}>
                    {secondaryItem?.CTA?.jsonValue?.value?.text ? (
                      <Link
                        field={secondaryItem?.CTA?.jsonValue}
                        className="no-underline py-2.5 pl-8 uppercase text-dark-gray"
                      />
                    ) : null}
                  </div>
                );
              })}
            </AccordionContent>
          ) : (
            <AccordionContent className="font-bold text-base text-dark-gray pb-2.6">
              <div className="flex flex-col">
                {Links?.targetItems?.map((item) => {
                  return (
                    <div key={`secondary_item_${item?.CTA?.jsonValue?.value?.id}`}>
                      <button
                        className="py-2.5 pl-3.6 cursor-pointer text-base text-dark-gray w-full text-left font-bold"
                        onClick={() => handleOpenLeftNavigation(item)}
                      >
                        {item?.CTA?.jsonValue?.value?.text
                          ? item?.CTA?.jsonValue?.value?.text
                          : item?.Title?.value}
                      </button>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default LeftNavigationMobile;
