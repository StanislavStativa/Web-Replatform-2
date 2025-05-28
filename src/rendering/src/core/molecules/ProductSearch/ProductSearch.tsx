import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { SearchResultProps } from '../ProductListing/ProductListing.type';

const ProductSearch = (props: SearchResultProps) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { search } = router?.query;

  const queryText: JSX.Element = <span className="font-bold">{search}</span>;
  const { t } = useI18n();
  if (typeof window !== 'undefined' && 'rfk' in window) {
    window?.rfk?.push({
      value: {
        context: {
          page: {
            uri: `/Search?search=${search}`,
          },
        },
        rfkid: props?.rendering ? props?.rendering?.fields?.DiscoverRfkId?.value?.toString() : '',
        f: 'sp',
      },
      type: 'widget',
      name: 'appear',
    });
  }
  const handleSearch = () => {
    router?.push(`/Search?search=${searchValue}`);
  };
  const pTagSubString = t('search_no_result')?.indexOf('{search_term}');
  const lastIndex = '{search_term}'?.length;
  const pTagSubStringSecond: JSX.Element = (
    <p>
      {t('search_no_result').substring(0, pTagSubString)}{' '}
      <span className="font-bold">
        {t('search_no_result')
          .substring(pTagSubString, pTagSubString + lastIndex)
          .replace('{search_term}', `"${search ? search.toString() : ''}"`)}
      </span>
      {t('search_no_result').substring(pTagSubString + lastIndex + 1)}
    </p>
  );

  return (
    <div className="relative md:px-10 px-7 ">
      <hr className="border-b border-input-border-gray" />
      {props?.searchResults ? (
        <p className="text-base pt-3">
          {`${t('search_term')} `}: {queryText}
        </p>
      ) : (
        <>
          <p className="font-normal text-dark-gray text-base pt-3">{pTagSubStringSecond}</p>
          <div className="my-4 flex md:flex-row flex-col md:items-center">
            <input
              id="search-term-input"
              type="text"
              className="mr-2 bg-white border border-input-border-gray shadow-input py-1.5 px-2 rounded-sm  focus:shadow-cyanBlue  focus-visible:outline-none focus:border-cyan-blue h-33 w-48"
              placeholder={t('search_item')}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              className="font-normal hover:bg-black h-43 w-fit"
              id="search-page-search-button"
              variant={ButtonVariant.BLACK}
              isCTATextInCaps={props?.params?.IsCTATextInCaps}
              size={SIZE.MEDIUM}
              onClick={() => handleSearch()}
            >
              {t('Labels_Search')}
            </Button>
          </div>
          {props?.rendering?.fields?.NoResultText?.value !== '' && (
            <RichText
              field={props?.rendering?.fields?.NoResultText}
              className="hover:[&_a]:text-black text-dark-gray"
            />
          )}
        </>
      )}
    </div>
  );
};
export default ProductSearch;
