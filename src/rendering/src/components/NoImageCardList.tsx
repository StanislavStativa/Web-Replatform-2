import React from 'react';
import NoImageCardList from '@/core/molecules/NoImageCardLisr/NoImageCardList';
import { type NoImageCardListProps } from '@/core/molecules/NoImageCardLisr/NoImageCardList.type';
import { useOnlyEditor } from '@/hooks/useEditor';

export const Default = (props: NoImageCardListProps): JSX.Element => {
  const isEditing = useOnlyEditor();
  return <NoImageCardList {...(!isEditing && { key: Date.now() })} {...props} />;
};
