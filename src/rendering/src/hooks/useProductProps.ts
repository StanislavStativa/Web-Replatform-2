import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

export const useProductUrlParam = () => {
  const { sitecoreContext } = useSitecoreContext();
  const path = sitecoreContext.itemPath?.toString();
  return path;
};
