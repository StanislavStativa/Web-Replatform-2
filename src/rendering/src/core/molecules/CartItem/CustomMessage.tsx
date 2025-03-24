import { authorizationAtom } from '@/data/atoms/authorization';
import { useAtom } from 'jotai';
import { type CartItemProps } from './CartItem.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import Link from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE } from '@/utils/constants';
import { useEffect, useState } from 'react';

const CustomMessage: React.FC<CartItemProps> = (props) => {
  const {
    CTAColor,
    CTASize,
    CTASecondarySize,
    SecondaryCTAColor,
    Size,
    Color,
    HeadingSize,
    HeadingTag,
  } = props?.params ?? {};

  const [{ isAuthenticated }] = useAtom(authorizationAtom);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col w-full py-4 px-3.7 md:px-41 rounded-xl border border-border-gray">
      <div className="flex md:py-6 gap-2 items-start flex-col">
        <Text
          field={props.rendering.fields.Title}
          tag={HeadingTag}
          size={HeadingSize}
          className={cn('text-2xl font-normal leading-29 text-dark-gray', {
            hidden: isAuthenticated,
          })}
        />

        <p className="text-base font-normal leading-4 md:leading-6 text-dark-gray">
          {isAuthenticated
            ? props.rendering.fields.SignedUserDescription.value
            : props.rendering.fields.GuestUserDescription.value}
        </p>

        {isAuthenticated ? (
          <Link
            field={props.rendering.fields.ShopNowCTA}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            variant={Color as LinkVariant}
            size={Size as SIZE}
          />
        ) : (
          <div className="py-4.9 flex items-start gap-2 mt-0.6 md:mt-0">
            <Link
              field={props.rendering.fields.PrimaryCTA}
              variant={CTAColor as LinkVariant}
              size={CTASize as SIZE}
            />
            <Link
              field={props.rendering.fields.SecondaryCTA}
              variant={SecondaryCTAColor as LinkVariant}
              size={CTASecondarySize as SIZE}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomMessage;
