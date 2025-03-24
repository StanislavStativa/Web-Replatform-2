import dynamic from 'next/dynamic';
import React from 'react';
import { IconType } from 'react-icons';
import { Item, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

const RenderIcon = (link: Item) => {
  const Icon = dynamic(() =>
    import('react-icons/fa').then((mod) => {
      const linkField = link?.fields?.SocialLink as LinkField;
      const name = linkField.value.title!;
      if (!mod[name]) {
        return () => null;
      }
      return mod[name] as IconType;
    })
  );

  return <Icon />;
};

export default RenderIcon;
