import Link from '@/core/atoms/Link/Link';
import { LinkField, Text, TextField, Link as JssLink } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { ITypesSubLinks, type IListProps } from './Footer.type';
import { BLOGDISPLAY } from '@/utils/constants';

const FooterLinkList: React.FC<IListProps> = (props) => {
  const { linkList } = props;

  return (
    <div className="md:columns-3 md:w-2/3 md:pb-5">
      {linkList?.map((FooterLink) => (
        <ul key={FooterLink.id} className="mb-3">
          <li>
            <h3 className="text-sm font-latoBold pt-3 mb-1.5">
              <Link
                field={FooterLink?.fields?.CTA as LinkField}
                className="no-underline hover:underline cursor-pointer !filter-none"
              />
            </h3>
          </li>
          <li className="leading-3">
            {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            FooterLink?.fields?.FooterSubLinks?.map((subLink: ITypesSubLinks) => {
              const title = subLink?.fields?.Title as TextField;
              return (
                <ul key={subLink.id}>
                  <li className="text-sm">
                    {title.value ? (
                      <Text field={title} className="hover:font-normal cursor-pointer" />
                    ) : (
                      <>
                        {/* for blog we are navigating to specified domain */}
                        {subLink?.displayName?.toLocaleLowerCase() === BLOGDISPLAY ? (
                          <JssLink
                            field={{
                              value: {
                                href: `${process.env.NEXT_PUBLIC_URL}${subLink?.fields?.Link?.value?.href?.replace(/^\/+/, '')}`,
                              },
                            }}
                            className="no-underline hover:underline hover:font-normal cursor-pointer !filter-none"
                          >
                            {subLink?.fields?.Link?.value?.text}
                          </JssLink>
                        ) : (
                          <Link
                            field={subLink?.fields?.Link as LinkField}
                            className="no-underline hover:underline hover:font-normal cursor-pointer !filter-none"
                          />
                        )}
                      </>
                    )}
                  </li>
                </ul>
              );
            })}
          </li>
        </ul>
      ))}
    </div>
  );
};

export default FooterLinkList;
