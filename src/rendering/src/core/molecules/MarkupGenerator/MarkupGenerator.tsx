import { useEffect } from 'react';
import Script from 'next/script';
import parse from './html-react-parser';
import React from 'react';
import Head from 'next/head';
import { MarkupData } from './markup-generator.utils';

function checkIsNotIgnored(href: string, cssIgnore: string[]) {
  const cssIgnoreSet = new Set(cssIgnore);

  for (const ignoreItem of cssIgnoreSet) {
    if (href.includes(ignoreItem)) {
      return false; // Return false if the href should be ignored
    }
  }

  return true; // Return true if the href is not ignored
}

const getHeadMarkup = (markup: MarkupData, cssIgnore: string[] = []) => {
  markup.slHeader.body.forEach(({ tagName, onLoad, ...props }) => {
    if (checkIsNotIgnored(props.href, cssIgnore)) {
      const _id = `${tagName}-${props.href}`;
      const link = document.createElement(tagName);
      link.setAttribute('id', _id);

      if (document.getElementById(_id)) {
        return;
      }

      Object.keys(props).forEach((key) => {
        if (key !== 'tagName' && key !== 'key' && key !== '__html') {
          link.setAttribute(key, props[key]);
        }
      });

      if (onLoad) {
        link.onload = () => {
          link.onload = null;
          link.removeAttribute('media');
        };
      }

      document.head.appendChild(link);
    }
  });
};

const MarkupGenerator = ({
  markup,
  cssIgnore = [],
  parser = true,
}: {
  markup: MarkupData;
  cssIgnore?: string[];
  parser?: boolean;
}) => {
  useEffect(() => {
    if (markup.slHeader.body) {
      getHeadMarkup(markup, cssIgnore);
    }
  }, [markup]);

  return (
    <>
      <Head>
        {markup.slHeader.head?.map(({ tagName, key, __html, ...props }) => {
          if (tagName === 'script') {
            return (
              <Script
                key={key}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html }}
                {...props}
              />
            );
          }
          if (tagName === 'link') {
            return <link key={key} href={props.href} rel={props.rel} media={props.media} />;
          }

          if (tagName === 'meta') {
            return <meta key={key} name={props.name} content={props.content} />;
          }

          if (tagName === 'title') {
            return <title key={key}>{__html}</title>;
          }

          return React.createElement(tagName, {
            key,
            dangerouslySetInnerHTML: { __html },
            ...props,
          });
        })}
      </Head>
      {parser ? parse(markup.slBody) : <div dangerouslySetInnerHTML={{ __html: markup.slBody }} />}
    </>
  );
};

export default MarkupGenerator;
