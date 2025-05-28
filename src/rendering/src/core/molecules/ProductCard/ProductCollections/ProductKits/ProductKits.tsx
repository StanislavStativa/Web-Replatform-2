import React, { memo } from 'react';
import { ITypesKitOption } from '../../ProductCard.type';
import { Root, List, TabsContent, Trigger } from '@radix-ui/react-tabs';
import KitCardsListing from './KitCardsListing';

export type ITypesProductKits = {
  productsKits: ITypesKitOption[];
  isHidden: boolean;
  selectedKit: string;
  setSelectedKit: (value: string) => void;
};

const ProductKits = ({
  productsKits,
  isHidden,
  selectedKit,
  setSelectedKit,
}: ITypesProductKits) => {
  return (
    <div
      className={`${isHidden ? 'hide-img' : ''}`}
      style={{ visibility: isHidden ? 'hidden' : 'visible' }}
    >
      <Root
        className="w-full flex justify-center items-center flex-col"
        value={selectedKit}
        onValueChange={setSelectedKit}
      >
        {/* Tabs Header */}
        <List className="flex align-center justify-center flex-wrap max-w-247 md:max-w-580">
          {productsKits?.map((tab) => {
            const value = tab?.KitOptionTitle?.jsonValue?.value as string;
            return (
              <Trigger
                key={value}
                value={value}
                className="group relative px-4 py-2 font-medium text-gray-500 transition-all duration-500 ease-out 
              hover:text-black data-[state=active]:text-black"
              >
                {value}
                <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-black scale-x-0 transition-transform duration-500 ease-out group-data-[state=active]:scale-x-100"></span>
              </Trigger>
            );
          })}
        </List>

        {/* Tabs Content */}
        {productsKits?.map((tab) => {
          const value = tab?.KitOptionTitle?.jsonValue?.value as string;
          return (
            <TabsContent
              key={value}
              value={value}
              className="p-4 opacity-0 translate-y-2 transition-all duration-500 ease-out data-[state=active]:opacity-100 data-[state=active]:translate-y-0 max-w-992"
            >
              <KitCardsListing
                DefaultItemsPerPageMobile={tab?.DefaultItemsPerPageMobile}
                DefaultItemsPerPageDesktop={tab?.DefaultItemsPerPageDesktop}
                DiscoverRfkId={tab?.DiscoverRfkId}
                id={value}
                ButtonFunctionality={tab?.ButtonFunctionality}
                ButtonText={tab?.ButtonText}
              />
            </TabsContent>
          );
        })}
      </Root>
    </div>
  );
};

export default memo(ProductKits);
