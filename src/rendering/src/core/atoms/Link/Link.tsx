/**
 * A React component that renders a link with customizable styles and behavior.
 *
 * @param props - The props for the Link component.
 * @param props.field - The Sitecore field data for the link.
 * @param props.children - The content to be rendered inside the link.
 * @param props.variant - The visual style variant of the link.
 * @param props.size - The size of the link.
 * @param props.className - Additional CSS classes to apply to the link.
 * @param props.editable - Whether the link is editable in Sitecore.
 * @param props.disabled - Whether the link is disabled.
 * @param props.ref - A ref to the underlying HTML anchor element.
 * @returns A React element representing the link.
 */

import { forwardRef } from 'react';
import { LinkProps, LinkVariant } from './Link.type';

import {
  Link as JssLink,
  LinkField,
  LinkFieldValue,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { FALLBACK_LANG, SIZE } from '@/utils/constants';
import NextLink from 'next/link';
import { cn } from '@/utils/cn';
import { formatPageUrl, reorderQueryParams } from '@/utils/url';
import { cva } from 'class-variance-authority';

export const linkVariants = cva(
  'inline-flex items-center justify-center w-auto h-max rounded-md transition-all duration-100 ease-in-out',
  {
    variants: {
      variant: {
        [LinkVariant.BLACK]: 'bg-dark-gray text-white',
        [LinkVariant.WHITE]: 'bg-white text-black',
        [LinkVariant.OUTLINE]: 'border  border-dark-gray text-dark-gray',
        [LinkVariant.OUTLINE_WHITE]: 'border border-white text-white',
        [LinkVariant.INLINE]: 'text-black',
      },
      size: {
        [SIZE.XSmall]: 'py-2 px-4 text-xs',
        [SIZE.SMALL]: 'py-2 px-4 text-xs', //12px
        [SIZE.MEDIUM]: 'py-3 px-6 text-sm', //14px
        [SIZE.LARGE]: 'py-3 px-8 text-base', //changed 16px as per ticket 17385
      },
    },
    defaultVariants: {
      variant: LinkVariant.INLINE,
    },
  }
);

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props: LinkProps, ref) => {
  const {
    field,
    children,
    variant,
    theme,
    size,
    className,
    editable = true,
    disabled,
    linkTitle,
    isCTAHoverEffect = true,
    ...htmlLinkProps
  } = props;
  const { sitecoreContext } = useSitecoreContext();
  const isEditing = sitecoreContext && sitecoreContext.pageState !== 'normal';
  const value = (
    (field as LinkFieldValue)?.href ? field : (field as LinkField)?.value
  ) as LinkFieldValue;
  const { href, querystring, anchor: hash, target, linktype } = value || {};
  const pageUrl = linktype === 'external' ? href : formatPageUrl(href);

  const linkTarget = linktype === 'external' ? target : '_self';

  if (isEditing && editable) {
    return (
      <JssLink
        field={field}
        className={cn(
          linkVariants({ variant, size, className }),
          {
            'border-white text-white': variant === LinkVariant.OUTLINE && theme === 'WHITE',
            'border-black text': variant === LinkVariant.OUTLINE && theme === 'BLACK',
            'hover:bg-black': variant === LinkVariant.BLACK && isCTAHoverEffect, // hover effect is added as per ticket 17419
            'hover:font-bold': variant === LinkVariant.WHITE && isCTAHoverEffect,

            'hover:text-black hover:border-black':
              variant === LinkVariant.OUTLINE && isCTAHoverEffect,
            'hover:shadow-md hover:border-opacity-65 hover:text-dark-gray hover:bg-white':
              variant === LinkVariant.OUTLINE_WHITE && isCTAHoverEffect,
          },
          value?.class
        )}
        ref={ref}
      />
    );
  }

  const _query = typeof querystring === 'string' ? querystring?.split('#') : undefined;
  const _hash = _query?.[1] || hash;

  if (disabled) {
    return (
      <button
        className={cn(
          linkVariants({ variant, size, className }),
          value?.class,
          props?.isCTATextInCaps && 'uppercase'
        )}
      >
        {children ?? value?.text}
      </button>
    );
  }

  const contextLanguage = sitecoreContext?.language?.split('-')?.[0]?.toLowerCase();

  const url =
    sitecoreContext?.language === FALLBACK_LANG &&
    pageUrl?.startsWith('/') &&
    pageUrl.split('/')[1] === sitecoreContext?.language
      ? pageUrl.replace(`/${sitecoreContext?.language}`, '')
      : pageUrl;

  const checkIfUrlStartsWithHttps = pageUrl?.startsWith('https');

  let pathname = '';

  if (checkIfUrlStartsWithHttps) {
    pathname = url ?? '';
  } else {
    pathname = url ? `${url.replace(process?.env?.NEXT_PUBLIC_URL ?? '', '/')}` : '';
  }

  const shouldRemoveLocale =
    !!pathname && contextLanguage === FALLBACK_LANG && pathname.startsWith(`/${FALLBACK_LANG}/`);

  if (shouldRemoveLocale) {
    pathname = pathname.replace(`/${FALLBACK_LANG}/`, '/');
  }

  return children || value?.text ? (
    <NextLink
      {...htmlLinkProps}
      href={
        linktype === 'external'
          ? pathname
          : { pathname, query: reorderQueryParams(querystring), hash: _hash }
      }
      className={cn(
        linkVariants({ variant, size, className }),
        {
          'border-white text-white': variant === LinkVariant.OUTLINE && theme === 'WHITE',
          'border-black text': variant === LinkVariant.OUTLINE && theme === 'BLACK',
          'hover:bg-black': variant === LinkVariant.BLACK && isCTAHoverEffect, // hover effect is added as per ticket 17419
          'hover:font-latoBold': variant === LinkVariant.WHITE && isCTAHoverEffect,

          'hover:text-black hover:border-black':
            variant === LinkVariant.OUTLINE && isCTAHoverEffect,
          'hover:shadow-md hover:border-opacity-65 hover:text-dark-gray hover:bg-white':
            variant === LinkVariant.OUTLINE_WHITE && isCTAHoverEffect,
        },
        value?.class,
        props?.isCTATextInCaps && 'uppercase'
      )}
      target={linkTarget}
      ref={ref}
      title={linkTitle}
    >
      {children ?? value?.text}
    </NextLink>
  ) : null;
});

Link.displayName = 'Link';

export default Link;
