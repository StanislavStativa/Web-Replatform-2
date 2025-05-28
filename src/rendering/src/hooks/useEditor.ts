import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { checkIsNotNormal, checkIsOnlyEdit } from '@/utils/config';

export const useEditor = () => {
  const { sitecoreContext } = useSitecoreContext();
  const isEditing = checkIsNotNormal(sitecoreContext);
  return isEditing;
};
export const useOnlyEditor = () => {
  const { sitecoreContext } = useSitecoreContext();
  const isEditing = checkIsOnlyEdit(sitecoreContext);
  return isEditing;
};
