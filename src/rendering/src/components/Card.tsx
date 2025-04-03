import React from 'react';
import TextAndImageCard from '@/core/molecules/Card/Card';
import { type TextAndImageCardProps } from '@/core/molecules/Card/Card.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { useOnlyEditor } from '@/hooks/useEditor';

const Default = (props: TextAndImageCardProps): JSX.Element => {
  const isEditing = useOnlyEditor();

  return <TextAndImageCard {...(!isEditing && { key: Date.now() })} {...props} />;
};
export default withDatasourceCheck()(Default);
